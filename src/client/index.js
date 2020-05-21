var io = require('socket.io-client')
var socket = io()

var _ = {
  player: {},
  camera: {
    following: 0,
    room: 0,
    x: 0,
    y: 0,
    element: 'canvas',
    elementID: '_0',
    width: 1920,
    height: 1080
  }
}

function initiateDistrict(district) {
  if (district) {
    _.imagesTotal = 0
    _.imagesLoaded = null
    _.district = district
    _.cityElementsBuffer = []
    createElements(district, 'loop')
    checkImagesLoaded()
  }
  else {
    drawToLayer('backgrounds')
    drawToLayer('foregrounds')
    shiftCityElementsBuffer('initiateRefresh')
  }
}

function createElements(cityElement, loop) {
  for (var property in cityElement) {
    if (property === 'element') {
      var $element = document.createElement(cityElement.element)
      $element.id = cityElement.elementID
      document.body.appendChild($element)
      if (cityElement !== _.camera) {
        $element.classList.add('hidden')
      }
      if (cityElement.width) {
        $element.width = cityElement.width
        $element.height = cityElement.height
      }
      if (cityElement.src) {
        if (!_.imagesTotal) _.imagesTotal = 0
        _.imagesTotal += 1
        $element.src = cityElement.src
        $element.onload = () => {
          if (!_.imagesLoaded) _.imagesLoaded = 0
          _.imagesLoaded += 1
        }
      }
    }
    else if (
      loop &&
      typeof cityElement[property] !== 'string' &&
      typeof cityElement[property] !== 'number' &&
      typeof cityElement[property] !== 'boolean'
    ) {
      var nestedObject = cityElement[property]
      createElements(nestedObject, 'loop')
    }
  }
}

function checkImagesLoaded() {
  clearTimeout(_.timeout)
  if (_.imagesLoaded === _.imagesTotal) initiateDistrict()
  else _.timeout = setTimeout(checkImagesLoaded, 50)
}

function drawToLayer(type) {
  var layers = _.district.scenery[type]
  for (var layerID in layers) {
    var layer = layers[layerID]
    var blueprints = layer.blueprints
    blueprints.forEach(blueprint => {
      var sectionID = blueprint.section
      var variationID = blueprint.variation
      var variation = layer.sections[sectionID].variations[variationID]
      var $variation = document.getElementById(variation.elementID)
      var $layer = document.getElementById(layer.elementID)
      var context = $layer.getContext('2d')
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
  }
}

function shiftCityElementsBuffer(initiatingRefresh) {
  clearTimeout(_.shiftTimeout)
  if (_.cityElementsBuffer.length > 2) {
    while (_.cityElementsBuffer.length > 2) _.cityElementsBuffer.shift()
    if (initiatingRefresh) {
      _.cityElements = _.cityElementsBuffer[0]
    }
    preservePlayerCharacterLocation(_.cityElementsBuffer[0])
    _.ratioIndex = -1
    if (initiatingRefresh) refresh('first')
  }
  else if (initiatingRefresh) {
    _.shiftTimeout = setTimeout(() => {
      shiftCityElementsBuffer(initiatingRefresh)
    }, 1000 / 30)
  }
}

function preservePlayerCharacterLocation(newCityElements) {
  var index = _.player.character
  _.xFromNewCityElements = newCityElements[index].x
  _.yFromNewCityElements = newCityElements[index].y
  var character = _.cityElements[index]
  var {x, y} = character
  _.cityElements = newCityElements
  character = _.cityElements[index]
  character.x = x
  character.y = y
}

function refresh(first) {
  _.refreshStartTime = performance.now()
  var ratio = getInterpolationRatio()
  if (ratio) interpolateDistrict(ratio)
  if (_.ratioIndex > 1) {
    shiftCityElementsBuffer()
    var result = checkPredictionOutcome()
    if (result) reconcilePlayerCharacter(result)
  }
  var input = {..._.player.input}
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
  _.ratioIndex += 1
  if (_.ratioIndex > 6) _.ratioIndex = 6
  return ratios[_.ratioIndex]
}

function interpolateDistrict(ratio) {
  var a = _.cityElementsBuffer[0]
  var b = _.cityElementsBuffer[1]
  _.cityElements.forEach(cityElement => {
    if (
      cityElement.district === _.district.id &&
      cityElement.type !== 'room' &&
      cityElement.id !== _.player.character
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
  var {predictionBuffer} = _.player
  if (!predictionBuffer[0]) return
  var characterIndex = _.player.character
  var character = _.cityElements[characterIndex]
  var {latency} = character
  if (!latency) return
  var timestamp = _.cityElements[0].timestamp
  var differences = predictionBuffer.map((prediction) => {
    var duration = timestamp - prediction.timestamp
    return Math.abs(duration - latency / 2)
  })
  var smallest = Math.min(...differences)
  var index = differences.findIndex(difference => difference === smallest)
  var prediction = predictionBuffer[index]
  if (prediction.x !== _.xFromNewCityElements || prediction.y !== _.yFromNewCityElements) {
    return index
  }
}

function reconcilePlayerCharacter(index) {
  var {predictionBuffer} = _.player
  var characterIndex = _.player.character
  var character = _.cityElements[characterIndex]
  character.x = _.xFromNewCityElements
  character.y = _.yFromNewCityElements
  for (var i = index; i < predictionBuffer.length; i++) {
    var input = predictionBuffer[i].input
    updatePlayerCharacterBehavior(input)
    updatePlayerCharacterLocation()
  }
}

function updatePredictionBuffer(input) {
  var index = _.player.character
  var character = _.cityElements[index]
  var {x, y} = character
  var prediction = {x, y, input, timestamp: performance.now()}
  _.player.predictionBuffer.push(prediction)
  if (_.player.predictionBuffer.length > 20) _.player.predictionBuffer.shift()
}

function updatePlayerCharacterBehavior(input) {
  var index = _.player.character
  var character = _.cityElements[index]
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
  var index = _.player.character
  var character = _.cityElements[index]
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
    var max = _.district.width - character.width
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
    var $camera = document.getElementById(_.camera.elementID)
    $camera.classList.add('hidden')
  }
  renderScenery('backgrounds')
  renderCityElements('characters')
  renderCityElements('vehicles')
  renderScenery('foregrounds')
  if (first) setTimeout(() => $camera.classList.remove('hidden'), 1250)
}

function updateCamera() {
  if (_.camera.following) {
    var cityElementID = _.camera.following
    if (
      _.district.characters.find(item => item === cityElementID) ||
      _.district.vehicles.find(item => item === cityElementID) ||
      _.district.rooms.find(item => item === cityElementID)
    ) {
      var cityElement = _.cityElements[cityElementID]
      if (cityElement.driving) cityElement = _.cityElements[cityElement.driving]
      _.camera.x = Math.round(cityElement.x - _.camera.width / 2)
      _.camera.y = Math.round(cityElement.y - _.camera.height / 2)
      var cameraMaxX = _.district.width - _.camera.width
      var cameraMaxY = _.district.height - _.camera.height
      if (_.camera.x < 0) _.camera.x = 0
      if (_.camera.x > cameraMaxX) _.camera.x = _.cameraMaxX
      if (_.camera.y < 0) _.camera.y = 0
      if (_.camera.y > cameraMaxY) _.camera.y = cameraMaxY
    }
  }
}

function clearCanvas() {
  var $camera = document.getElementById(_.camera.elementID)
  var context = $camera.getContext('2d')
  context.clearRect(0, 0, _.camera.width, _.camera.height)
}

function renderScenery(type) {
  var layers = _.district.scenery[type]
  for (var layerID in layers) {
    var layer = layers[layerID]
    var cityElementID = _.camera.following
    var cityElement = _.cityElements[cityElementID]
    var $layer = document.getElementById(layer.elementID)
    var $camera = document.getElementById(_.camera.elementID)
    var context = $camera.getContext('2d')
    if (layer.x) var layerX = layer.x
    else layerX = 0
    var cameraX = Math.round(cityElement.x / layer.depth - _.camera.width / 2 / layer.depth - layerX)
    var cameraMaxX = Math.round(_.district.width / layer.depth - _.camera.width / layer.depth - layerX)
    if (cameraX > cameraMaxX) cameraX = cameraMaxX
    if (!layer.x && cameraX < 0) cameraX = 0
    context.drawImage($layer, cameraX, _.camera.y, _.camera.width,
      _.camera.height, 0, 0, _.camera.width, _.camera.height)
  }
}

function renderCityElements(cityElementType) {
  _.district[cityElementType].forEach(cityElementID => {
    var cityElement = _.cityElements[cityElementID]
    var {driving, passenging, occupying} = cityElement
    if (!(driving || passenging || occupying)) {
      var xInCamera = cityElement.x - _.camera.x
      var yInCamera = cityElement.y - _.camera.y
      if (!(
        xInCamera > _.camera.width + cityElement.width ||
        xInCamera < 0 - cityElement.width ||
        yInCamera > _.camera.height + cityElement.height ||
        yInCamera < 0 - cityElement.height
      )) {

        var $cityElement = document.getElementById(cityElement.elementID)
        var $camera = document.getElementById(_.camera.elementID)
        var context = $camera.getContext('2d')
        if (cityElement.direction) {
          var {direction, previousDirection} = cityElement
          if (
            direction === 'left' ||
            direction === 'up-left' ||
            direction === 'down-left' ||
            (direction === 'up' && previousDirection === 'left') ||
            (direction === 'up' && previousDirection === 'up-left') ||
            (direction === 'up' && previousDirection === 'down-left') ||
            (direction === 'down' && previousDirection === 'left') ||
            (direction === 'down' && previousDirection === 'up-left') ||
            (direction === 'down' && previousDirection === 'down-left')
          ) {
            context.scale(-1, 1)
            xInCamera = -cityElement.x + _.camera.x - cityElement.width / 2
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
  if (!_.setDelay) _.setDelay = {}
  var __ = _.setDelay
  if (!__.loopStartTime) __.loopStartTime = performance.now() - 1000 / 30
  if (!__.millisecondsAhead) __.millisecondsAhead = 0
  var refreshDuration = performance.now() - _.refreshStartTime
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
    if (action === 'down') _.player.input.left = true
    if (action === 'up') _.player.input.left = false
  }
  if (key === 'd' || key === 'D' || key === 'ArrowRight') {
    if (action === 'down') _.player.input.right = true
    if (action === 'up') _.player.input.right = false
  }
  if (key === 'w' || key === 'W' || key === 'ArrowUp') {
    if (action === 'down') _.player.input.up = true
    if (action === 'up') _.player.input.up = false
  }
  if (key === 's' || key === 'S' || key === 'ArrowDown') {
    if (action === 'down') _.player.input.down = true
    if (action === 'up') _.player.input.down = false
  }
  if (key === ' ') {
    if (action === 'down') _.player.input.action = true
    if (action === 'up') _.player.input.action = false
  }
  if (key === 'n' || key === 'N') {
    if (action === 'down') _.player.input.accelerate = true
    if (action === 'up') _.player.input.accelerate = false
  }
  if (key === 'm' || key === 'M') {
    if (action === 'down') _.player.input.decelerate = true
    if (action === 'up') _.player.input.decelerate = false
  }
}

window.addEventListener('resize', () => {
  if (document.getElementById(_.camera.elementID)) {
    var $camera = document.getElementById(_.camera.elementID)
    _.camera.width = innerWidth
    _.camera.height = innerHeight
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
  var token = _.player.token
  socket.emit('token', token)
})

socket.on('district', district => {
  initiateDistrict(district)
})

socket.on('player', player => {
  _.player = player
  _.camera.following = _.player.character
})

socket.on('cityElement', cityElement => {
  if (_.district) {
    var match = _.district[cityElement.type + 's'].find(id => id === cityElement.id)
    if (!match) {
      _.district[cityElement.type + 's'].push(cityElement.id)
      createElements(cityElement)
    }
  }
})

socket.on('cityElements', cityElements => {
  var timestamp = cityElements[0].timestamp
  cityElements[0].timestamp = performance.now()
  socket.emit('timestamp', timestamp)
  if (!_.cityElements) cityElements.forEach(cityElement => createElements(cityElement))
  _.cityElementsBuffer.push(cityElements)
})

_.camera.width = innerWidth
_.camera.height = innerHeight

createElements(_.camera)
