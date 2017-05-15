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
    _.objectsBuffer = []
    createElements(district, 'loop')
    checkImagesLoaded()
  }
  else {
    drawToLayer('backgrounds')
    drawToLayer('foregrounds')
    shiftDistrictBuffer('initiateRefresh')
  }
}

function createElements(object, loop) {
  for (var property in object) {
    if (property === 'element') {
      var $element = document.createElement(object.element)
      $element.id = object.elementID
      document.body.appendChild($element)
      if (object !== _.camera) {
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
      context.drawImage($variation, 0, 0, variation.width, variation.height,
        x, y, variation.width, variation.height)
      context.setTransform(1, 0, 0, 1, 0, 0)
    })
  }
}

function shiftDistrictBuffer(initiatingRefresh) {
  clearTimeout(_.shiftTimeout)
  if (_.objectsBuffer.length > 2) {
    while (_.objectsBuffer.length > 2) _.objectsBuffer.shift()
    if (initiatingRefresh) _.objects = _.objectsBuffer[0]
    preservePlayerCharacterLocation(_.objectsBuffer[0])
    _.ratioIndex = -1
    if (initiatingRefresh) refresh('first')
  }
  else {
    _.shiftTimeout = setTimeout(() => {
      shiftDistrictBuffer(initiatingRefresh)
    }, 1000 / 60)
  }
}

function preservePlayerCharacterLocation(newObjects) {
  var index = _.player.character - 1
  _.xFromNewObjects = newObjects[index].x
  _.yFromNewObjects = newObjects[index].y
  var character = _.objects[index]
  var {x, y} = character
  _.objects = newObjects
  character.x = x
  character.y = y
}

function refresh(first) {
  console.log('refresh');
  _.refreshStartTime = performance.now()
  var ratio = getInterpolationRatio()
  if (ratio) interpolateDistrict(ratio)
  if (_.ratioIndex > 1) {
    shiftDistrictBuffer()
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
  var a = _.objectsBuffer[0]
  var b = _.objectsBuffer[1]
  if (ratio === 1) preservePlayerCharacterLocation(b)
  else {
    _.objects.forEach(object => {
      if (object.district === _.district.id && object.type !== 'room') {
        var id = object.id
        var properties = ['x', 'y']
        properties.forEach(property => {
          var difference = b[id - 1][property] - a[id - 1][property]
          object[property] = a[id - 1][property] + difference * ratio
        })
      }
    })
  }
}

function checkPredictionOutcome() {
  var {predictionBuffer} = _.player
  if (!predictionBuffer[0]) return
  var characterIndex = _.player.character - 1
  var character = _.objects[characterIndex]
  var {latency} = character
  var timestamp = _.objects[0].timestamp
  var differences = predictionBuffer.map((prediction) => {
    var duration = timestamp - prediction.timestamp
    return Math.abs(duration - latency)
  })
  var smallest = Math.min(...differences)
  var index = differences.findIndex(difference => difference === smallest)
  var prediction = predictionBuffer[index]
  if (prediction.x !== _.xFromNewObjects || prediction.y !== _.yFromNewObjects) {
    return index
  }
}

function reconcilePlayerCharacter(index) {
  var {predictionBuffer} = _.player
  var characterIndex = _.player.character - 1
  var character = _.objects[characterIndex]
  character.x = _.xFromNewObjects
  character.y = _.yFromNewObjects
  for (var i = index; i < predictionBuffer.length; i++) {
    var input = predictionBuffer[i].input
    updatePlayerCharacterBehavior(input)
    updatePlayerCharacterLocation()
  }
}

function updatePredictionBuffer(input) {
  var index = _.player.character - 1
  var character = _.objects[index]
  var {x, y} = character
  var prediction = {x, y, input, timestamp: performance.now()}
  _.player.predictionBuffer.push(prediction)
  if (_.player.predictionBuffer.length > 20) _.player.predictionBuffer.shift()
}

function updatePlayerCharacterBehavior(input) {
  var index = _.player.character - 1
  var character = _.objects[index]
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
  var index = _.player.character - 1
  var character = _.objects[index]
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
  renderObjects('characters')
  renderObjects('vehicles')
  renderScenery('foregrounds')
  if (first) setTimeout(() => $camera.classList.remove('hidden'), 750)
}

function updateCamera() {
  if (_.camera.following) {
    var objectID = _.camera.following
    if (
      _.district.characters.find(item => item === objectID) ||
      _.district.vehicles.find(item => item === objectID) ||
      _.district.rooms.find(item => item === objectID)
    ) {
      var object = _.objects[objectID - 1]
      _.camera.x = Math.round(object.x - _.camera.width / 2)
      _.camera.y = Math.round(object.y - _.camera.height / 2)
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
    var objectID = _.camera.following
    var object = _.objects[objectID - 1]
    var $layer = document.getElementById(layer.elementID)
    var $camera = document.getElementById(_.camera.elementID)
    var context = $camera.getContext('2d')
    if (layer.x) var layerX = layer.x
    else layerX = 0
    var cameraX = Math.round(object.x / layer.depth - _.camera.width / 2 / layer.depth - layerX)
    var cameraMaxX = Math.round(_.district.width / layer.depth - _.camera.width / layer.depth - layerX)
    if (cameraX > cameraMaxX) cameraX = cameraMaxX
    if (!layer.x && cameraX < 0) cameraX = 0
    context.drawImage($layer, cameraX, _.camera.y, _.camera.width,
      _.camera.height, 0, 0, _.camera.width, _.camera.height)
  }
}

function renderObjects(objectType) {
  _.district[objectType].forEach(objectID => {
    var object = _.objects[objectID - 1]
    var xInCamera = object.x - _.camera.x
    var yInCamera = object.y - _.camera.y
    if (!(
      xInCamera > _.camera.width + object.width ||
      xInCamera < 0 - object.width ||
      yInCamera > _.camera.height + object.height ||
      yInCamera < 0 - object.height
    )) {
      var $object = document.getElementById(object.elementID)
      var $camera = document.getElementById(_.camera.elementID)
      var context = $camera.getContext('2d')
      if (object.direction) {
        if (object.direction === 'left') {
          context.scale(-1, 1)
          xInCamera = Math.round(-object.x + _.camera.x - object.width / 2)
        }
      }
      context.drawImage($object, xInCamera, yInCamera)
      context.setTransform(1, 0, 0, 1, 0, 0)
    }
  })
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
    if (action === 'down') _.player.input.left = true
    if (action === 'up') _.player.input.left = false
  }
  if (key === 'd' || key === 'D' || key === 'ArrowRight') {
    if (action === 'down') _.player.input.right = true
    if (action === 'up') _.player.input.right = false
  }
  if (key === 'e' || key === 'E' || key === 'ArrowUp') {
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

socket.on('player', receivedPlayer => {
  _.player = receivedPlayer
  _.camera.following = _.player.character
})

socket.on('object', object => {
  createElements(object)
  if (_.district) _.district[object.type + 's'].push(object.id)
})

socket.on('objects', objects => {
  var timestamp = objects[0].timestamp
  objects[0].timestamp = performance.now()
  socket.emit('timestamp', timestamp)
  if (!_.objects) objects.forEach(object => createElements(object))
  if (_.objectsBuffer) _.objectsBuffer.push(objects)
})

_.camera.width = innerWidth
_.camera.height = innerHeight

createElements(_.camera)
