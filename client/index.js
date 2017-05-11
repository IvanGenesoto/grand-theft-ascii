var io = require('socket.io-client')
var socket = io()

var _ = {
  imagesTotal: 0,
  imagesLoaded: null
}

var camera = {
  following: 0,
  room: 0,
  x: 0,
  y: 0,
  element: 'canvas',
  elementID: '_0',
  width: 1920,
  height: 1080
}

var player = null
var district = null
var districtBuffer = []

function initiateDistrict(imagesLoaded) {
  if (imagesLoaded) {
    drawToLayer('backgrounds')
    drawToLayer('foregrounds')
    shiftDistrictBuffer('initiateRefresh')
  }
  else {
    createElements(district, 'loop')
    checkImagesLoaded()
  }
}

function createElements(object, loop) {
  for (var property in object) {
    if (property === 'element') {
      var $element = document.createElement(object.element)
      $element.id = object.elementID
      document.body.appendChild($element)
      if (object !== camera) {
        $element.classList.add('hidden')
      }
      if (object.width) {
        $element.width = object.width
        $element.height = object.height
      }
      if (object.src) {
        if (!_.imagesTotal) _.imagesTotal = 0
        _.imagesTotal += 1
        $element.src = object.src
        $element.onload = () => {
          if (!_.imagesLoaded) _.imagesLoaded = 0
          _.imagesLoaded += 1
        }
      }
    }
    else if (
      loop &&
      typeof object[property] !== 'string' &&
      typeof object[property] !== 'number' &&
      typeof object[property] !== 'boolean'
    ) {
      var nestedObject = object[property]
      createElements(nestedObject, 'loop')
    }
  }
}

function checkImagesLoaded() {
  clearTimeout(_.timeout)
  if (_.imagesLoaded === _.imagesTotal) initiateDistrict('imagesLoaded')
  else _.timeout = setTimeout(checkImagesLoaded, 50)
}

function drawToLayer(type) {
  var layers = district.scenery[type]
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
      context.drawImage($variation, 0, 0, variation.width, variation.height,
        x, y, variation.width, variation.height)
      context.setTransform(1, 0, 0, 1, 0, 0)
    })
  }
}

function shiftDistrictBuffer(initiatingRefresh) {
  clearTimeout(_.shiftTimeout)
  if (districtBuffer.length > 2) {
    while (districtBuffer.length > 2) districtBuffer.shift()
    _.ratioIndex = -1
    preservePlayerCharacterLocation(districtBuffer[0])
    if (initiatingRefresh) refresh()
  }
  else {
    _.shiftTimeout = setTimeout(() => {
      shiftDistrictBuffer(initiatingRefresh)
    }, 1000 / 60)
  }
}

function preservePlayerCharacterLocation(bufferedDistrict) {
  _.bufferedDistrictX = bufferedDistrict.characters[player.character].x
  _.bufferedDistrictY = bufferedDistrict.characters[player.character].y
  var {x, y} = district.characters[player.character]
  district = bufferedDistrict
  var character = district.characters[player.character]
  character.x = x
  character.y = y
}

function refresh() {
  _.refreshStartTime = performance.now()
  var ratio = getInterpolationRatio()
  if (ratio) interpolateDistrict(ratio)
  if (_.ratioIndex > 1) {
    shiftDistrictBuffer()
    var result = checkPredictionOutcome()
    if (result) reconcilePlayerCharacter(result)
  }
  var input = {...player.input}
  socket.emit('input', input)
  updatePredictionBuffer(input)
  updatePlayerCharacterSpeedDirection(input)
  updatePlayerCharacterLocation()
  render()
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
  var a = districtBuffer[0]
  var b = districtBuffer[1]
  if (ratio === 1) preservePlayerCharacterLocation(b)
  else {
    for (var objectType in district) {
      if (objectType === 'aiCharacters' ||
        objectType === 'vehicles'
      ) {
        var objects = district[objectType]
        for (var objectID in objects) {
          var object = objects[objectID]
          var properties = ['x', 'y']
          properties.forEach(property => {
            var difference = b[objectType][objectID][property] - a[objectType][objectID][property]
            object[property] = a[objectType][objectID][property] + difference * ratio
          })
        }
      }
    }
  }
}

function checkPredictionOutcome() {
  var {predictionBuffer} = player
  if (!predictionBuffer[0]) return
  var character = district.characters[player.character]
  var {latencyBuffer} = character
  if (!latencyBuffer[0]) return
  var {timestamp} = district
  var total = latencyBuffer.reduce((total, latency) => total + latency)
  var latency = total / latencyBuffer.length
  var differences = predictionBuffer.map((prediction) => {
    var duration = timestamp - prediction.timestamp
    return Math.abs(duration - latency)
  })
  var smallest = Math.min(...differences)
  var index = differences.findIndex(difference => difference === smallest)
  var prediction = predictionBuffer[index]
  if (prediction.x !== _.bufferedDistrictX || prediction.y !== _.bufferedDistrictY) {
    return index
  }
}

function reconcilePlayerCharacter(index) {
  var {predictionBuffer} = player
  var character = district.characters[player.character]
  character.x = _.bufferedDistrictX
  character.y = _.bufferedDistrictY
  for (var i = index; i < predictionBuffer.length; i++) {
    var input = predictionBuffer[i].input
    updatePlayerCharacterSpeedDirection(input)
    updatePlayerCharacterLocation()
  }
}

function updatePredictionBuffer(input) {
  var character = district.characters[player.character]
  var {x, y} = character
  var prediction = {x, y, input: {...player.input}, timestamp: performance.now()}
  player.predictionBuffer.push(prediction)
  if (player.predictionBuffer.length > 20) player.predictionBuffer.shift()
}

function updatePlayerCharacterSpeedDirection(input) {
  var character = district.characters[player.character]
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
  var character = district.characters[player.character]
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
    var max = district.width - character.width
    if (nextX < min) {
      character.x = min
    }
    if (nextX > max) {
      character.x = max
    }
  }
}

function render() {
  updateCamera()
  clearCanvas()
  renderScenery('backgrounds')
  renderObject('aiCharacters')
  renderObject('characters')
  renderObject('vehicles')
  renderScenery('foregrounds')
}

function updateCamera() {
  if (camera.following) {
    var characterID = camera.following
    var character = district.characters[characterID]
    camera.x = Math.round(character.x - camera.width / 2)
    camera.y = Math.round(character.y - camera.height / 2)
    var cameraMaxX = district.width - camera.width
    var cameraMaxY = district.height - camera.height
    if (camera.x < 0) camera.x = 0
    if (camera.x > cameraMaxX) camera.x = cameraMaxX
    if (camera.y < 0) camera.y = 0
    if (camera.y > cameraMaxY) camera.y = cameraMaxY
  }
}

function clearCanvas() {
  var $camera = document.getElementById(camera.elementID)
  var context = $camera.getContext('2d')
  context.clearRect(0, 0, camera.width, camera.height)
}

function renderScenery(type) {
  var layers = district.scenery[type]
  for (var layerID in layers) {
    var layer = layers[layerID]
    var characterID = camera.following
    var character = district.characters[characterID]
    var $layer = document.getElementById(layer.elementID)
    var $camera = document.getElementById(camera.elementID)
    var context = $camera.getContext('2d')
    if (layer.x) var layerX = layer.x
    else layerX = 0
    var cameraX = Math.round(character.x / layer.depth - camera.width / 2 / layer.depth - layerX)
    var cameraMaxX = Math.round(district.width / layer.depth - camera.width / layer.depth - layerX)
    if (cameraX > cameraMaxX) cameraX = cameraMaxX
    if (!layer.x && cameraX < 0) cameraX = 0
    context.drawImage($layer, cameraX, camera.y, camera.width,
      camera.height, 0, 0, camera.width, camera.height)
  }
}

function renderObject(objectType) {
  var objects = district[objectType]
  for (var objectID in objects) {
    var object = objects[objectID]
    var $object = document.getElementById(object.elementID)
    var $camera = document.getElementById(camera.elementID)
    var context = $camera.getContext('2d')
    var xInCamera = object.x - camera.x
    var yInCamera = object.y - camera.y
    if (!(
      xInCamera > camera.width ||
      xInCamera < 0 ||
      yInCamera > camera.height ||
      yInCamera < 0
    )) {
      if (object.direction) {
        if (object.direction === 'left') {
          context.scale(-1, 1)
          xInCamera = Math.round(-object.x + camera.x - object.width / 2)
        }
      }
      context.drawImage($object, xInCamera, yInCamera)
      context.setTransform(1, 0, 0, 1, 0, 0)
    }
  }
}

function setDelay() {
  if (!_.setDelay) _.setDelay = {}
  var __ = _.setDelay
  if (!__.loopStartTime) __.loopStartTime = performance.now() - 1000 / 60
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
  var millisecondsPerFrame = 1000 / 60
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
    if (action === 'down') player.input.left = true
    if (action === 'up') player.input.left = false
  }
  if (key === 'd' || key === 'D' || key === 'ArrowRight') {
    if (action === 'down') player.input.right = true
    if (action === 'up') player.input.right = false
  }
  if (key === 'e' || key === 'E' || key === 'ArrowUp') {
    if (action === 'down') player.input.up = true
    if (action === 'up') player.input.up = false
  }
  if (key === 's' || key === 'S' || key === 'ArrowDown') {
    if (action === 'down') player.input.down = true
    if (action === 'up') player.input.down = false
  }
}

window.addEventListener('resize', () => {
  if (document.getElementById(camera.elementID)) {
    var $camera = document.getElementById(camera.elementID)
    camera.width = innerWidth
    camera.height = innerHeight
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

socket.on('player', receivedPlayer => {
  player = receivedPlayer
  camera.following = player.character
})

socket.on('character', character => {
  createElements(character)
  if (district) district.characters[character.id] = character
})

socket.on('request-token', () => {
  var token = player.token
  socket.emit('token', token)
})

socket.on('district', receivedDistrict => {
  var {timestamp} = receivedDistrict
  receivedDistrict.timestamp = performance.now()
  socket.emit('timestamp', timestamp)
  if (_.districtInitiated) districtBuffer.push(receivedDistrict)
  else {
    _.districtInitiated = true
    district = receivedDistrict
    initiateDistrict()
  }
})

camera.width = innerWidth
camera.height = innerHeight

createElements(camera)
