import socketIo from 'socket.io-client'

const socket = socketIo()

const camera = {
  following: 0,
  room: 0,
  x: 0,
  y: 0,
  tag: 'canvas',
  elementId: 'c0',
  maxWidth: 1280,
  maxHeight: 720,
  style: {}
}

const state = {
  socket,
  camera,
  imagesTotal: 0,
  imagesLoaded: 0,
  player: {},
  delayKit: {},
  entitiesBuffer: [],
  $game: document.getElementById('game')
}

const createElement = function (component) {
  const {state} = this
  const {$game, camera} = state
  const {tag, elementId, src, width, height} = component
  const $element = document.createElement(tag)
  $element.id = elementId
  $game.appendChild($element)
  component === camera || $element.classList.add('hidden')
  width && ($element.width = width)
  height && ($element.height = height)
  if (!src) return state
  ++state.imagesTotal
  $element.src = src
  $element.onload = () => ++state.imagesLoaded
  return state
}

const adjustCameraSize = function () {
  const {state} = this
  const {camera} = state
  const {style: style_, maxWidth, maxHeight, elementId} = camera
  const horizontalMargin = (innerWidth - maxWidth) / 2 + 'px'
  const verticalMargin = (innerHeight - maxHeight) / 2 + 'px'
  const $camera = document.getElementById(elementId)
  const {style} = $camera || {}
  if (innerWidth < maxWidth) {
    camera.width = innerWidth
    style_.marginLeft = 0
    style_.marginRight = 0
    $camera && ($camera.width = innerWidth)
    $camera && (style.marginLeft = 0)
    $camera && (style.marginRight = 0)
  }
  if (innerHeight < maxHeight) {
    camera.height = innerHeight
    style_.marginTop = 0
    style_.marginBottom = 0
    $camera && ($camera.height = innerHeight)
    $camera && (style.marginTop = 0)
    $camera && (style.marginBottom = 0)
  }
  if (innerWidth > maxWidth) {
    camera.width = maxWidth
    style_.marginLeft = horizontalMargin
    style_.marginRight = horizontalMargin
    $camera && ($camera.width = maxWidth)
    $camera && (style.marginLeft = horizontalMargin)
    $camera && (style.marginRight = horizontalMargin)
  }
  if (innerHeight > maxHeight) {
    camera.height = maxHeight
    style_.marginTop = verticalMargin
    style_.marginBottom = verticalMargin
    $camera && ($camera.height = maxHeight)
    $camera && (style.marginTop = verticalMargin)
    $camera && (style.marginBottom = verticalMargin)
  }
  return state
}

const emitToken = function () {
  const {state, socket} = this
  const {player} = state
  const {token} = player
  socket.emit('token', token)
}

const handlePlayer = function (player) {
  const {state} = this
  const {camera} = state
  const {character} = player
  state.player = player
  camera.following = character
}

const handleEntity = function (entity) {
  const {state} = this
  const {district} = state
  const {type, id: entityId} = entity
  const key = type + 's'
  const entityIds = district[key]
  const match = entityIds.find(id => id === entityId)
  if (!district || match) return state
  state.district[entity.type + 's'].push(entity.id)
  createElement.call({state}, entity)
}

const handleEntities = function (entities) {
  const {state} = this
  const {socket, entitiesBuffer, entities: entities_} = state
  const [mayor] = entities
  const timestamp = mayor.timestamp
  mayor.timestamp = performance.now()
  socket.emit('timestamp', timestamp)
  if (!entities_) entities.forEach(createElement.bind({state}))
  entitiesBuffer.push(entities)
}

function initializeDistrict(district) {
  const {state} = this
  const {backgroundLayers, foregroundLayers} = district
  state.district = district
  backgroundLayers.forEach(createElements.bind({state}))
  foregroundLayers.forEach(createElements.bind({state}))
  checkImagesLoaded()
}

function initiateDistrict() {
  const {state} = this
  const {district} = state
  const {backgroundLayers, foregroundLayers} = district
  drawToLayer(backgroundLayers)
  drawToLayer(foregroundLayers)
  shiftEntitiesBuffer('initiateRefresh')
}

function createElements(component) {
  const {tag, sections, variations} = component
  tag && createElement.call(this, component)
  sections && sections.map(createElements.bind(this))
  variations && variations.map(createElements.bind(this))
}

function checkImagesLoaded() {
  clearTimeout(state.timeout)
  if (state.imagesLoaded === state.imagesTotal) initiateDistrict.call({state})
  else state.timeout = setTimeout(checkImagesLoaded, 50)
}

function drawToLayer(layers) {
  layers.forEach(layer => {
    var {blueprints} = layer
    blueprints.forEach(blueprint => {
      const {sectionId} = blueprint
      const {variationId} = blueprint
      const variation = layer.sections[sectionId - 1].variations[variationId - 1]
      const $variation = document.getElementById(variation.elementId)
      const $layer = document.getElementById(layer.elementId)
      const context = $layer.getContext('2d')
      if (layer.scale) {
        context.scale(layer.scale, layer.scale)
        var x = blueprint.x / layer.scale
        var y = blueprint.y / layer.scale
      }
      else {
        x = blueprint.x
        y = blueprint.y
      }
      context.drawImage(
        $variation, 0, 0, variation.width, variation.height, x, y, variation.width, variation.height
      )
      context.setTransform(1, 0, 0, 1, 0, 0)
    })
  })
}

function shiftEntitiesBuffer(initiatingRefresh) {
  clearTimeout(state.shiftTimeout)
  if (state.entitiesBuffer.length > 2) {
    while (state.entitiesBuffer.length > 2) state.entitiesBuffer.shift()
    if (initiatingRefresh) {
      state.entities = state.entitiesBuffer[0]
    }
    preservePlayerCharacterLocation(state.entitiesBuffer[0])
    state.ratioIndex = -1
    if (initiatingRefresh) refresh(true)
  }
  else if (initiatingRefresh) {
    state.shiftTimeout = setTimeout(() => {
      shiftEntitiesBuffer(initiatingRefresh)
    }, 1000 / 30)
  }
}

function preservePlayerCharacterLocation(newCityElements) {
  var index = state.player.character
  state.xFromNewCityElements = newCityElements[index].x
  state.yFromNewCityElements = newCityElements[index].y
  var character = state.entities[index]
  var {x, y} = character
  state.entities = newCityElements
  character = state.entities[index]
  character.x = x
  character.y = y
}

function refresh(isInitial) {
  state.refreshStartTime = performance.now()
  var ratio = getInterpolationRatio()
  if (ratio) interpolateDistrict(ratio)
  if (state.ratioIndex > 1) {
    shiftEntitiesBuffer()
    var result = checkPredictionOutcome()
    if (result) reconcilePlayerCharacter(result)
  }
  var input = {...state.player.input}
  socket.emit('input', input)
  updatePredictionBuffer(input)
  updatePlayerCharacterBehavior(input)
  updatePlayerCharacterLocation()
  updateCamera()
  // clearCanvas()
  render(isInitial)
  callRefresh()
}

function getInterpolationRatio() {
  var ratios = [
    0,
    1 / 3,
    2 / 3,
    1,
    4 / 3,
    5 / 3,
    2
  ]
  state.ratioIndex += 1
  if (state.ratioIndex > 6) state.ratioIndex = 6
  return ratios[state.ratioIndex]
}

function interpolateDistrict(ratio) {
  var a = state.entitiesBuffer[0]
  var b = state.entitiesBuffer[1]
  state.entities.forEach(entity => {
    if (
         entity.district === state.district.id
      && entity.type !== 'room'
      && entity.id !== state.player.character
    ) {
      var id = entity.id
      var properties = ['x', 'y']
      properties.forEach(property => {
        var difference = b[id][property] - a[id][property]
        entity[property] = a[id][property] + difference * ratio
      })
    }
  })
}

function checkPredictionOutcome() {
  var {predictionBuffer} = state.player
  if (!predictionBuffer[0]) return
  var characterIndex = state.player.character
  var character = state.entities[characterIndex]
  var {latency} = character
  if (!latency) return
  var timestamp = state.entities[0].timestamp
  var differences = predictionBuffer.map((prediction) => {
    var duration = timestamp - prediction.timestamp
    return Math.abs(duration - latency)
  })
  var smallest = Math.min(...differences)
  var index = differences.findIndex(difference => difference === smallest)
  var prediction = predictionBuffer[index]
  if (prediction.x !== state.xFromNewCityElements || prediction.y !== state.yFromNewCityElements) {
    return index
  }
}

function reconcilePlayerCharacter(index) {
  var {predictionBuffer} = state.player
  var characterIndex = state.player.character
  var character = state.entities[characterIndex]
  character.x = state.xFromNewCityElements
  character.y = state.yFromNewCityElements
  for (var i = index; i < predictionBuffer.length; i++) {
    var input = predictionBuffer[i].input
    updatePlayerCharacterBehavior(input)
    updatePlayerCharacterLocation()
  }
}

function updatePredictionBuffer(input) {
  var index = state.player.character
  var character = state.entities[index]
  var {x, y} = character
  var prediction = {x, y, input, timestamp: performance.now()}
  state.player.predictionBuffer.push(prediction)
  if (state.player.predictionBuffer.length > 20) state.player.predictionBuffer.shift()
}

function updatePlayerCharacterBehavior(input) {
  var index = state.player.character
  var character = state.entities[index]
  if (input.right === true) {
    character.direction = 'right'
    character.speed = character.maxSpeed
  }
  else if (input.left === true) {
    character.direction = 'left'
    character.speed = character.maxSpeed
  }
  else character.speed = 0
}

function updatePlayerCharacterLocation() {
  var index = state.player.character
  var character = state.entities[index]
  if (character.speed > 0) {
    if (character.direction === 'left') {
      character.x -= character.speed
      var nextX = character.x - character.speed
    }
    else if (character.direction === 'right') {
      character.x += character.speed
      nextX = character.x + character.speed
    }
    var min = 0
    var max = state.district.width - character.width
    if (nextX < min) {
      character.x = min
    }
    if (nextX > max) {
      character.x = max
    }
  }
}

function render(isInitial) {
  const {district} = state
  const {backgroundLayers, foregroundLayers} = district
  if (isInitial) {
    var $camera = document.getElementById(state.camera.elementId)
    $camera.classList.add('hidden')
  }
  renderLayers(backgroundLayers)
  renderEntities('characters')
  renderEntities('vehicles')
  renderLayers(foregroundLayers)
  if (isInitial) setTimeout(() => $camera.classList.remove('hidden'), 1250)
}

function updateCamera() {
  if (state.camera.following) {
    var entityId = state.camera.following
    if (
         state.district.characters.find(item => item === entityId)
      || state.district.vehicles.find(item => item === entityId)
      || state.district.rooms.find(item => item === entityId)
    ) {
      var entity = state.entities[entityId]
      if (entity.driving) entity = state.entities[entity.driving]
      state.camera.x = Math.round(entity.x - state.camera.width / 2)
      state.camera.y = Math.round(entity.y - state.camera.height / 2)
      var cameraMaxX = state.district.width - state.camera.width
      var cameraMaxY = state.district.height - state.camera.height
      if (state.camera.x < 0) state.camera.x = 0
      if (state.camera.x > cameraMaxX) state.camera.x = state.cameraMaxX
      if (state.camera.y < 0) state.camera.y = 0
      if (state.camera.y > cameraMaxY) state.camera.y = cameraMaxY
    }
  }
}

// function clearCanvas() {
//   var $camera = document.getElementById(state.camera.elementId)
//   var context = $camera.getContext('2d')
//   context.clearRect(0, 0, state.camera.width, state.camera.height)
// }

function renderLayers(layers) {
  layers.forEach(layer => {
    var entityId = state.camera.following
    var entity = state.entities[entityId]
    var $layer = document.getElementById(layer.elementId)
    var $camera = document.getElementById(state.camera.elementId)
    var context = $camera.getContext('2d')
    if (layer.x) var layerX = layer.x
    else layerX = 0
    var cameraX = Math.round(entity.x / layer.depth - state.camera.width / 2 / layer.depth - layerX)
    var cameraMaxX = Math.round(state.district.width / layer.depth - state.camera.width / layer.depth - layerX)
    if (cameraX > cameraMaxX) cameraX = cameraMaxX
    if (!layer.x && cameraX < 0) cameraX = 0
    context.drawImage($layer, cameraX, state.camera.y, state.camera.width,
      state.camera.height, 0, 0, state.camera.width, state.camera.height)
  })
}

function renderEntities(entityType) {
  const {camera} = state
  state.district[entityType].forEach(entityId => {
    const entity = state.entities[entityId]
    const {driving, passenging, occupying} = entity
    if (!(driving || passenging || occupying)) {
      let xInCamera = entity.x - camera.x
      let yInCamera = entity.y - camera.y
      if (!(
           xInCamera > camera.width
        || xInCamera < 0 - entity.width
        || yInCamera > camera.height
        || yInCamera < 0 - entity.height
      )) {
        const $entity = document.getElementById(entity.elementId)
        const $camera = document.getElementById(camera.elementId)
        const context = $camera.getContext('2d')
        if (entity.direction) {
          const {direction, previousDirection} = entity
          if (
               direction === 'left'
            || direction === 'up-left'
            || direction === 'down-left'
            || (direction === 'up' && previousDirection === 'left')
            || (direction === 'up' && previousDirection === 'up-left')
            || (direction === 'up' && previousDirection === 'down-left')
            || (direction === 'down' && previousDirection === 'left')
            || (direction === 'down' && previousDirection === 'up-left')
            || (direction === 'down' && previousDirection === 'down-left')
          ) {
            context.scale(-1, 1)
            xInCamera = -entity.x + camera.x - entity.width / 2
          }
        }
        xInCamera = Math.round(xInCamera)
        yInCamera = Math.round(yInCamera)
        context.drawImage($entity, xInCamera, yInCamera)
        context.setTransform(1, 0, 0, 1, 0, 0)
      }
    }
  })
}

function callRefresh() {
  const {delayKit: _} = state
  if (!_.loopStartTime) _.loopStartTime = performance.now() - 1000 / 30
  if (!_.millisecondsAhead) _.millisecondsAhead = 0
  var refreshDuration = performance.now() - state.refreshStartTime
  var loopDuration = performance.now() - _.loopStartTime
  _.loopStartTime = performance.now()
  var delayDuration = loopDuration - refreshDuration
  if (_.checkForSlowdown) {
    if (delayDuration > _.delay * 1.2) {
      _.slowdownCompensation = _.delay / delayDuration
      _.slowdownConfirmed = true
    }
  }
  var millisecondsPerFrame = 1000 / 30
  _.millisecondsAhead += millisecondsPerFrame - loopDuration
  _.delay = millisecondsPerFrame + _.millisecondsAhead - refreshDuration
  clearTimeout(_.timeout)
  if (_.delay < 5) {
    _.checkForSlowdown = false
    refresh()
  }
  else {
    if (_.slowdownConfirmed) {
      _.delay = _.delay * _.slowdownCompensation
      if (_.delay < 14) {
        if (_.delay < 7) {
          refresh()
        }
        else {
          _.checkForSlowdown = true
          _.slowdownConfirmed = false
          _.timeout = setTimeout(refresh, 0)
        }
      }
      else {
        _.checkForSlowdown = true
        _.slowdownConfirmed = false
        var delay = Math.round(_.delay)
        _.timeout = setTimeout(refresh, delay - 2)
      }
    }
    else {
      _.checkForSlowdown = true
      delay = Math.round(_.delay - 2)
      _.timeout = setTimeout(refresh, delay)
    }
  }
}

function control(key, action) {
  if (key === 'a' || key === 'A' || key === 'ArrowLeft') {
    if (action === 'down') state.player.input.left = true
    if (action === 'up') state.player.input.left = false
  }
  if (key === 'd' || key === 'D' || key === 'ArrowRight') {
    if (action === 'down') state.player.input.right = true
    if (action === 'up') state.player.input.right = false
  }
  if (key === 'w' || key === 'W' || key === 'ArrowUp') {
    if (action === 'down') state.player.input.up = true
    if (action === 'up') state.player.input.up = false
  }
  if (key === 's' || key === 'S' || key === 'ArrowDown') {
    if (action === 'down') state.player.input.down = true
    if (action === 'up') state.player.input.down = false
  }
  if (key === ' ') {
    if (action === 'down') state.player.input.action = true
    if (action === 'up') state.player.input.action = false
  }
  if (key === 'n' || key === 'N') {
    if (action === 'down') state.player.input.accelerate = true
    if (action === 'up') state.player.input.accelerate = false
  }
  if (key === 'm' || key === 'M') {
    if (action === 'down') state.player.input.decelerate = true
    if (action === 'up') state.player.input.decelerate = false
  }
}

window.addEventListener('resize', adjustCameraSize.bind({state}), false)
window.addEventListener('keydown', event => control(event.key, 'down'))
window.addEventListener('keyup', event => control(event.key, 'up'))
socket.on('request_token', emitToken.bind({state, socket}))
socket.on('district', initializeDistrict.bind({state}))
socket.on('player', handlePlayer.bind({state}))
socket.on('entity', handleEntity.bind({state}))
socket.on('entities', handleEntities.bind({state}))
createElement.call({state}, camera)
adjustCameraSize.call({state})
