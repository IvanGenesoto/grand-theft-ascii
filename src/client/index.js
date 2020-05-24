import socketIo from 'socket.io-client'

var socket = socketIo()

var camera = {
  following: 0,
  room: 0,
  x: 0,
  y: 0,
  tag: 'canvas',
  elementId: '_0',
  width: 1920,
  height: 1080
}

var state = {player: {}, camera}

function initiateDistrict(district) {
  if (district) {
    state.imagesTotal = 0
    state.imagesLoaded = null
    state.district = district
    state.cityElementsBuffer = []
    createElements(district, 'loop')
    checkImagesLoaded()
  }
  else {
    drawToLayer('backgroundLayers')
    drawToLayer('foregroundLayers')
    shiftCityElementsBuffer('initiateRefresh')
  }
}

function createElements(cityElement, loop) {
  for (var property in cityElement) {
    if (property === 'tag') {
      var $element_ = document.createElement(cityElement.tag)
      $element_.id = cityElement.elementId
      document.body.appendChild($element_)
      if (cityElement !== state.camera) {
        $element_.classList.add('hidden')
      }
      if (cityElement.width) {
        $element_.width = cityElement.width
        $element_.height = cityElement.height
      }
      if (cityElement.src) {
        if (!state.imagesTotal) state.imagesTotal = 0
        state.imagesTotal += 1
        $element_.src = cityElement.src
        $element_.onload = () => {
          if (!state.imagesLoaded) state.imagesLoaded = 0
          state.imagesLoaded += 1
        }
      }
    }
    else if (
         loop
      && typeof cityElement[property] !== 'string'
      && typeof cityElement[property] !== 'number'
      && typeof cityElement[property] !== 'boolean'
    ) {
      var nestedObject = cityElement[property]
      createElements(nestedObject, 'loop')
    }
  }
}

function checkImagesLoaded() {
  clearTimeout(state.timeout)
  if (state.imagesLoaded === state.imagesTotal) initiateDistrict()
  else state.timeout = setTimeout(checkImagesLoaded, 50)
}

function drawToLayer(type) {
  var layers = state.district.scenery[type]
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

function shiftCityElementsBuffer(initiatingRefresh) {
  clearTimeout(state.shiftTimeout)
  if (state.cityElementsBuffer.length > 2) {
    while (state.cityElementsBuffer.length > 2) state.cityElementsBuffer.shift()
    if (initiatingRefresh) {
      state.entities = state.cityElementsBuffer[0]
    }
    preservePlayerCharacterLocation(state.cityElementsBuffer[0])
    state.ratioIndex = -1
    if (initiatingRefresh) refresh('first')
  }
  else if (initiatingRefresh) {
    state.shiftTimeout = setTimeout(() => {
      shiftCityElementsBuffer(initiatingRefresh)
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

function refresh(first) {
  state.refreshStartTime = performance.now()
  var ratio = getInterpolationRatio()
  if (ratio) interpolateDistrict(ratio)
  if (state.ratioIndex > 1) {
    shiftCityElementsBuffer()
    var result = checkPredictionOutcome()
    if (result) reconcilePlayerCharacter(result)
  }
  var input = {...state.player.input}
  socket.emit('input', input)
  updatePredictionBuffer(input)
  updatePlayerCharacterBehavior(input)
  updatePlayerCharacterLocation()
  updateCamera()
  clearCanvas()
  render(first)
  setDelay()
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
  var a = state.cityElementsBuffer[0]
  var b = state.cityElementsBuffer[1]
  state.entities.forEach(cityElement => {
    if (
         cityElement.district === state.district.id
      && cityElement.type !== 'room'
      && cityElement.id !== state.player.character
    ) {
      var id = cityElement.id
      var properties = ['x', 'y']
      properties.forEach(property => {
        var difference = b[id][property] - a[id][property]
        cityElement[property] = a[id][property] + difference * ratio
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
    character.speed = 5
  }
  else if (input.left === true) {
    character.direction = 'left'
    character.speed = 5
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

function render(first) {
  if (first) {
    var $camera = document.getElementById(state.camera.elementId)
    $camera.classList.add('hidden')
  }
  renderScenery('backgroundLayers')
  renderCityElements('characters')
  renderCityElements('vehicles')
  renderScenery('foregroundLayers')
  if (first) setTimeout(() => $camera.classList.remove('hidden'), 1250)
}

function updateCamera() {
  if (state.camera.following) {
    var cityElementId = state.camera.following
    if (
         state.district.characters.find(item => item === cityElementId)
      || state.district.vehicles.find(item => item === cityElementId)
      || state.district.rooms.find(item => item === cityElementId)
    ) {
      var cityElement = state.entities[cityElementId]
      if (cityElement.driving) cityElement = state.entities[cityElement.driving]
      state.camera.x = Math.round(cityElement.x - state.camera.width / 2)
      state.camera.y = Math.round(cityElement.y - state.camera.height / 2)
      var cameraMaxX = state.district.width - state.camera.width
      var cameraMaxY = state.district.height - state.camera.height
      if (state.camera.x < 0) state.camera.x = 0
      if (state.camera.x > cameraMaxX) state.camera.x = state.cameraMaxX
      if (state.camera.y < 0) state.camera.y = 0
      if (state.camera.y > cameraMaxY) state.camera.y = cameraMaxY
    }
  }
}

function clearCanvas() {
  var $camera = document.getElementById(state.camera.elementId)
  var context = $camera.getContext('2d')
  context.clearRect(0, 0, state.camera.width, state.camera.height)
}

function renderScenery(type) {
  var layers = state.district.scenery[type]
  for (var layerId in layers) {
    var layer = layers[layerId]
    var cityElementId = state.camera.following
    var cityElement = state.entities[cityElementId]
    var $layer = document.getElementById(layer.elementId)
    var $camera = document.getElementById(state.camera.elementId)
    var context = $camera.getContext('2d')
    if (layer.x) var layerX = layer.x
    else layerX = 0
    var cameraX = Math.round(cityElement.x / layer.depth - state.camera.width / 2 / layer.depth - layerX)
    var cameraMaxX = Math.round(state.district.width / layer.depth - state.camera.width / layer.depth - layerX)
    if (cameraX > cameraMaxX) cameraX = cameraMaxX
    if (!layer.x && cameraX < 0) cameraX = 0
    context.drawImage($layer, cameraX, state.camera.y, state.camera.width,
      state.camera.height, 0, 0, state.camera.width, state.camera.height)
  }
}

function renderCityElements(cityElementType) {
  state.district[cityElementType].forEach(cityElementId => {
    var cityElement = state.entities[cityElementId]
    var {driving, passenging, occupying} = cityElement
    if (!(driving || passenging || occupying)) {
      var xInCamera = cityElement.x - state.camera.x
      var yInCamera = cityElement.y - state.camera.y
      if (!(
           xInCamera > state.camera.width + cityElement.width
        || xInCamera < 0 - cityElement.width
        || yInCamera > state.camera.height + cityElement.height
        || yInCamera < 0 - cityElement.height
      )) {

        var $cityElement = document.getElementById(cityElement.elementId)
        var $camera = document.getElementById(state.camera.elementId)
        var context = $camera.getContext('2d')
        if (cityElement.direction) {
          var {direction, previousDirection} = cityElement
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
            xInCamera = -cityElement.x + state.camera.x - cityElement.width / 2
          }
        }

        xInCamera = Math.round(xInCamera)
        yInCamera = Math.round(yInCamera)
        context.drawImage($cityElement, xInCamera, yInCamera)
        context.setTransform(1, 0, 0, 1, 0, 0)
      }
    }
  })
}

function setDelay() {
  if (!state.setDelay) state.setDelay = {}
  var __ = state.setDelay
  if (!__.loopStartTime) __.loopStartTime = performance.now() - 1000 / 30
  if (!__.millisecondsAhead) __.millisecondsAhead = 0
  var refreshDuration = performance.now() - state.refreshStartTime
  var loopDuration = performance.now() - __.loopStartTime
  __.loopStartTime = performance.now()
  var delayDuration = loopDuration - refreshDuration
  if (__.checkForSlowdown) {
    if (delayDuration > __.delay * 1.2) {
      __.slowdownCompensation = __.delay / delayDuration
      __.slowdownConfirmed = true
    }
  }
  var millisecondsPerFrame = 1000 / 30
  __.millisecondsAhead += millisecondsPerFrame - loopDuration
  __.delay = millisecondsPerFrame + __.millisecondsAhead - refreshDuration
  clearTimeout(__.timeout)
  if (__.delay < 5) {
    __.checkForSlowdown = false
    refresh()
  }
  else {
    if (__.slowdownConfirmed) {
      __.delay = __.delay * __.slowdownCompensation
      if (__.delay < 14) {
        if (__.delay < 7) {
          refresh()
        }
        else {
          __.checkForSlowdown = true
          __.slowdownConfirmed = false
          __.timeout = setTimeout(refresh, 0)
        }
      }
      else {
        __.checkForSlowdown = true
        __.slowdownConfirmed = false
        var delay = Math.round(__.delay)
        __.timeout = setTimeout(refresh, delay - 2)
      }
    }
    else {
      __.checkForSlowdown = true
      delay = Math.round(__.delay - 2)
      __.timeout = setTimeout(refresh, delay)
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

window.addEventListener('resize', () => {
  if (document.getElementById(state.camera.elementId)) {
    var $camera = document.getElementById(state.camera.elementId)
    state.camera.width = innerWidth
    state.camera.height = innerHeight
    $camera.width = innerWidth
    $camera.height = innerHeight
  }
}, false)

window.addEventListener('keydown', event => {
  control(event.key, 'down')
})

window.addEventListener('keyup', event => {
  control(event.key, 'up')
})

socket.on('request_token', () => {
  var token = state.player.token
  socket.emit('token', token)
})

socket.on('district', district => {
  initiateDistrict(district)
})

socket.on('player', player => {
  state.player = player
  state.camera.following = state.player.character
})

socket.on('cityElement', cityElement => {
  if (state.district) {
    var match = state.district[cityElement.type + 's'].find(id => id === cityElement.id)
    if (!match) {
      state.district[cityElement.type + 's'].push(cityElement.id)
      createElements(cityElement)
    }
  }
})

socket.on('entities', entities => {
  var timestamp = entities[0].timestamp
  entities[0].timestamp = performance.now()
  socket.emit('timestamp', timestamp)
  if (!state.entities) entities.forEach(cityElement => createElements(cityElement))
  state.cityElementsBuffer.push(entities)
})

state.camera.width = innerWidth
state.camera.height = innerHeight
createElements(state.camera)
