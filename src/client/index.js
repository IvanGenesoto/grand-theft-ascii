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
  performance,
  fps: 30,
  tick: 0,
  imagesTotal: 0,
  imagesLoaded: 0,
  player: {},
  delayKit: {},
  entitiesBuffer: [],
  predictionBuffer: [],
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
  else {
    camera.width = maxWidth
    style_.marginLeft = horizontalMargin
    style_.marginRight = horizontalMargin
    $camera && ($camera.width = maxWidth)
    $camera && (style.marginLeft = horizontalMargin)
    $camera && (style.marginRight = horizontalMargin)
  }
  if (innerHeight < maxHeight) {
    camera.height = innerHeight
    style_.marginTop = 0
    style_.marginBottom = 0
    $camera && ($camera.height = innerHeight)
    $camera && (style.marginTop = 0)
    $camera && (style.marginBottom = 0)
  }
  else {
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
  const {timestamp} = mayor
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
  checkImagesLoaded.call(this)
}

const initiateDistrict = state => {
  const {district} = state
  const {backgroundLayers, foregroundLayers} = district
  backgroundLayers.forEach(drawBlueprints)
  foregroundLayers.forEach(drawBlueprints)
  shiftEntitiesBuffer(state, true)
}

function createElements(component) {
  const {tag, sections, variations} = component
  tag && createElement.call(this, component)
  sections && sections.map(createElements.bind(this))
  variations && variations.map(createElements.bind(this))
}

function checkImagesLoaded() {
  const {state} = this
  const {timeoutId, imagesLoaded, imagesTotal} = state
  clearTimeout(timeoutId)
  if (imagesLoaded === imagesTotal) return initiateDistrict(state)
  state.timeoutId = setTimeout(checkImagesLoaded.bind(this), 50)
}

const drawBlueprints = layer => {
  const {blueprints} = layer
  blueprints.forEach(drawBlueprint, {layer})
}

const drawBlueprint = function (blueprint) {
  const {layer} = this
  const {sections, elementId, scale} = layer
  const {sectionIndex, variationIndex} = blueprint
  const section = sections[sectionIndex]
  const {variations} = section
  const variation = variations[variationIndex]
  const {width, height} = variation
  const $variation = document.getElementById(variation.elementId)
  const $layer = document.getElementById(elementId)
  const context = $layer.getContext('2d')
  scale && context.scale(scale, scale)
  const x = scale ? blueprint.x / scale : blueprint.x
  const y = scale ? blueprint.y / scale : blueprint.y
  context.drawImage($variation, 0, 0, width, height, x, y, width, height)
  context.setTransform(1, 0, 0, 1, 0, 0)
}

const shiftEntitiesBuffer = (state, isInitial) => {
  const {shiftingTimeoutId, entitiesBuffer, fps} = state
  const {length} = entitiesBuffer
  const shiftEntitiesBufferWithThese = shiftEntitiesBuffer.bind(null, state, isInitial)
  const delay = 1000 / fps
  clearTimeout(shiftingTimeoutId)
  if (length <= 2) return isInitial && (state.shiftingTimeoutId = setTimeout(
    shiftEntitiesBufferWithThese, delay
  ))
  while (entitiesBuffer.length > 2) entitiesBuffer.shift()
  const [entities] = entitiesBuffer
  isInitial && (state.entities = entities)
  preservePlayerCharacterLocation(entities, state)
  state.ratioIndex = -1
  isInitial && refresh(state, true)
}

function preservePlayerCharacterLocation(newEntities, state) {
  const {player, entities} = state
  const index = player.character
  const playerCharacter = entities[index]
  const {x, y} = playerCharacter
  const newPlayerCharacter = newEntities[index]
  state.xFromNewEntities = newPlayerCharacter.x
  state.yFromNewEntities = newPlayerCharacter.y
  state.entities = newEntities
  newPlayerCharacter.x = x
  newPlayerCharacter.y = y
}

const refresh = (state, isInitial) => {
  const {performance, player, entities} = state
  const {character: characterId} = player
  const character = entities[characterId]
  const {driving} = character
  const tick = ++state.tick
  const input = {...player.input, tick}
  const ratio = getInterpolationRatio(state)
  state.refreshStartTime = performance.now()
  socket.emit('input', input)
  shiftEntitiesBuffer(state)
  driving || updatePlayerCharacterBehavior(input)
  driving || updatePlayerCharacterLocation()
  driving || checkPredictions(state)
  driving || updatePredictionBuffer(input, state)
  interpolateDistrict(ratio, state)
  updateCamera()
  render(isInitial)
  callRefresh(state)
}

const getInterpolationRatio = state => {
  const ratios = [
    0,
    1 / 3,
    2 / 3,
    1,
    4 / 3,
    5 / 3,
    2
  ]
  const {ratioIndex} = state
  const index = ratioIndex > 6 ? 6 : ++state.ratioIndex
  return ratios[index]
}

const interpolateDistrict = (ratio, state) => {
  const {entities} = state
  entities.forEach(interpolateEntityIfShould, {state, ratio})
}

const interpolateEntityIfShould = function (entity) {
  const {state} = this
  const {player, district} = state
  const shouldInterpolate = getShouldInterpolate(entity, district, player)
  shouldInterpolate && interpolateEntity.call({...this, entity})
}

const getShouldInterpolate = (entity, district, player) => (
     entity.district === district.id
  && entity.type !== 'room'
  && entity.id !== player.character
)

const interpolateEntity = function () {
  const propertyNames = ['x', 'y']
  propertyNames.forEach(interpolateProperty, this)
}

const interpolateProperty = function (propertyName) {
  const {state, entity, ratio} = this
  const {entitiesBuffer} = state
  const [a, b] = entitiesBuffer
  const {id: index} = entity
  const difference = b[index][propertyName] - a[index][propertyName]
  entity[propertyName] = a[index][propertyName] + difference * ratio
}

const checkPredictions = state => {
  const index = checkPredictionFromTick(state)
  if (index || index === 0) reconcilePlayerCharacter(index, state)
}

const checkPredictionFromTick = state => {
  const {predictionBuffer, entities, player} = state
  const characterId = player.character
  const character = entities[characterId]
  const {tick} = character
  const tick_ = tick
  const index = predictionBuffer.findIndex(({tick}) => tick === tick_)
  return index === -1 ? 0 : comparePrediction(index, state)
}

const comparePrediction = (index, state) => {
  const {predictionBuffer, xFromNewEntities, yFromNewEntities} = state
  const prediction = predictionBuffer[index]
  const {x, y} = prediction || {}
  const x_ = Math.round(x)
  const y_ = Math.round(y)
  const xFromNewEntities_ = Math.round(xFromNewEntities)
  const yFromNewEntities_ = Math.round(yFromNewEntities)
  const wasWrong = x_ !== xFromNewEntities_ || y_ !== yFromNewEntities_
  return !wasWrong || index
}

function reconcilePlayerCharacter(index, state) {
  const {predictionBuffer, player, entities, xFromNewEntities, yFromNewEntities} = state
  const {character: characterId} = player
  const character = entities[characterId]
  const predictionBuffer_ = predictionBuffer.slice(index)
  character.x = xFromNewEntities
  character.y = yFromNewEntities
  predictionBuffer.length = 0
  predictionBuffer_.forEach(({input}, index) => {
    index && updatePlayerCharacterBehavior(input)
    index && updatePlayerCharacterLocation()
    updatePredictionBuffer(input, state)
  })
}

function updatePredictionBuffer(input, state) {
  const {player, entities, predictionBuffer} = state
  const {character: characterId} = player
  const character = entities[characterId]
  const {tick} = input || {}
  const {x, y} = character
  const prediction = {x, y, tick, input}
  predictionBuffer.push(prediction)
  if (predictionBuffer.length > 60) predictionBuffer.shift()
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

function renderLayers(layers) {
  layers.forEach(layer => {
    var entityId = state.camera.following
    var entity = state.entities[entityId]
    if (entity.driving) entity = state.entities[entity.driving]
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

const callRefresh = state => {
  const {delayKit: _, fps, performance} = state
  const millisecondsPerFrame = 1000 / fps
  const refreshWithState = refresh.bind(null, state)
  if (!_.loopStartTime) _.loopStartTime = performance.now() - millisecondsPerFrame
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
  _.millisecondsAhead += millisecondsPerFrame - loopDuration
  _.delay = millisecondsPerFrame + _.millisecondsAhead - refreshDuration
  clearTimeout(_.timeout)
  if (_.delay < 5) {
    _.checkForSlowdown = false
    refreshWithState()
  }
  else {
    if (_.slowdownConfirmed) {
      _.delay = _.delay * _.slowdownCompensation
      if (_.delay < 14) {
        if (_.delay < 7) {
          refreshWithState()
        }
        else {
          _.checkForSlowdown = true
          _.slowdownConfirmed = false
          _.timeout = setTimeout(refreshWithState, 0)
        }
      }
      else {
        _.checkForSlowdown = true
        _.slowdownConfirmed = false
        var delay = Math.round(_.delay)
        _.timeout = setTimeout(refreshWithState, delay - 2)
      }
    }
    else {
      _.checkForSlowdown = true
      delay = Math.round(_.delay - 2)
      _.timeout = setTimeout(refreshWithState, delay)
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
