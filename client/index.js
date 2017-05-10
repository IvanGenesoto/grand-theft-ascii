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

var queuedDistrict = null

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
      createElements(nestedObject, true)
    }
  }
}

function checkImagesLoaded() {
  clearTimeout(_.timeout)
  if (_.imagesLoaded === _.imagesTotal) drawToLayers()
  else _.timeout = setTimeout(checkImagesLoaded, 50)
}

function drawToLayers() {
  drawToLayer('backgrounds')
  drawToLayer('foregrounds')
  refresh()
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

function refresh() {
  _.refreshStartTime = performance.now()
  socket.emit('input', player.input)
  player.inputBuffer.push({...player.input})
  updateObjects()
  updateDistrict()
  district.tick += 1
  render()
  setDelay()
}

function updateObjects(rerun) {
  updatePlayerCharactersSpeedDirection(rerun)
  updateLocation('characters', rerun)
  updateLocation('aiCharacters', rerun)
  updateLocation('vehicles', rerun)
}

function updateDistrict() {
  if (queuedDistrict) {
    district = queuedDistrict
    queuedDistrict = null
    player.inputBuffer.forEach(input => updateObjects('rerun'))
    player.inputBuffer = []
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

function updatePlayerCharactersSpeedDirection(rerun) {
  if (rerun) var input = player.inputBuffer[0]
  else input = player.input
  var characterID = player.character
  var character = district.characters[characterID]
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

function updateLocation(objectType, rerun) {
  if (rerun && objectType !== 'characters') return
  var objects = district[objectType]
  for (var objectID in objects) {
    if (rerun) {
      var s = objectType.length - 1
      objectType = objectType.slice(0, s)
      objectID = player[objectType]
    }
    var object = objects[objectID]
    if (object.speed > 0) {
      if (object.direction === 'left') {
        object.x -= object.speed
        var nextX = object.x - object.speed
      }
      else if (object.direction === 'right') {
        object.x += object.speed
        nextX = object.x + object.speed
      }
      var min = 0
      var max = district.width - object.width
      if (nextX < min) {
        object.direction = 'right'
      }
      if (nextX > max) {
        object.direction = 'left'
      }
    }
    if (rerun) return
  }
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

function renderScenery(sceneryType) {
  var layers = district.scenery[sceneryType]
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

// function getAverage(value, bufferName, maxItems = 60, precision = 1000) {
//   if (!_.getAverage) _.getAverage = {}
//   var __ = _.getAverage
//   if (!__[bufferName]) __[bufferName] = []
//   __[bufferName].push(value)
//   if (__[bufferName].length > maxItems) __[bufferName].shift()
//   var total = __[bufferName].reduce((total, value) => {
//     return total + value
//   }, 0)
//   var average = total / __[bufferName].length
//   return Math.round(average * precision) / precision
// }

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
  receivedPlayer.inputBuffer = []
  player = receivedPlayer
  camera.following = receivedPlayer.character
})

socket.on('character', character => {
  createElements(character)
})

socket.on('request-token', () => {
  var token = player.token
  socket.emit('token', token)
})

socket.on('district', receivedDistrict => {
  var timestamp = receivedDistrict.timestamp
  socket.emit('timestamp', timestamp)
  console.log(receivedDistrict.tick);
  if (district) {
    queuedDistrict = receivedDistrict
  }
  else {
    district = receivedDistrict
    createElements(district, true)
    checkImagesLoaded()
  }
})

camera.width = innerWidth
camera.height = innerHeight

createElements(camera)
