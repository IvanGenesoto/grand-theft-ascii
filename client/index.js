var io = require('socket.io-client')
var socket = io()

var client = {
  tick: 1,
  timestamp: 1,
  imagesTotal: 0,
  imagesLoaded: null,
  setDelay: {
    timeoutID: 0,
    millisecondsAhead: 0,
    totalStartTime: 0,
    refreshStartTime: 0
  }
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
        client.imagesTotal += 1
        $element.src = object.src
        $element.onload = () => {
          if (!client.imagesLoaded) client.imagesLoaded = 0
          client.imagesLoaded += 1
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
  clearTimeout(client.timeoutID)
  if (client.imagesLoaded === client.imagesTotal) drawToLayers()
  else client.timeoutID = setTimeout(checkImagesLoaded, 50)
}

function drawToLayers() {
  drawToLayer('backgrounds')
  drawToLayer('foregrounds')
  client.setDelay.totalStartTime = performance.now() - 1000 / 60
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
  client.setDelay.refreshStartTime = performance.now()
  client.tick += 1
  if (queuedDistrict) updateDistrict()
  // setTimeout(() => {
  socket.emit('input', player.input)
  // }, 3000)
  player.inputBuffer.push(player.input)
  updatePlayerCharactersSpeedDirection()
  updateLocation('characters')
  updateLocation('aiCharacters')
  updateLocation('vehicles')
  updateCamera()
  // if (!client.skipRender) {
  clearCanvas()
  renderScenery('backgrounds')
  render('aiCharacters')
  render('characters')
  render('vehicles')
  renderScenery('foregrounds')
  // }
  // client.skipRender = false
  setDelay()
}

function updateDistrict() {
  district = queuedDistrict
  queuedDistrict = null
  player.inputBuffer = []
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

function updatePlayerCharactersSpeedDirection() {
  var input = player.input
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

function updateLocation(type) {
  var objects = district[type]
  for (var objectID in objects) {
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

function render(type) {
  var objects = district[type]
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
  var _ = client.setDelay
  var refreshDuration = performance.now() - _.refreshStartTime
  var totalDuration = performance.now() - _.totalStartTime
  _.totalStartTime = performance.now()
  var delayDuration = totalDuration - refreshDuration
  if (_.checkForSlowdown) {
    if (delayDuration > _.delay * 1.2) {
      _.slowdownCompensation = _.delay / delayDuration
      _.slowdownConfirmed = true
    }
  }
  _.millisecondsAhead += 16.666667 - totalDuration
  _.delay = 16.666667 + _.millisecondsAhead - refreshDuration
  clearTimeout(_.timeoutID)
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
          _.timeoutID = setTimeout(refresh, 0)
        }
      }
      else {
        _.checkForSlowdown = true
        _.slowdownConfirmed = false
        var delay = Math.round(_.delay)
        _.timeoutID = setTimeout(refresh, delay - 2)
      }
    }
    else {
      _.checkForSlowdown = true
      delay = Math.round(_.delay)
      _.timeoutID = setTimeout(refresh, delay - 2)
    }
  }
}

function getAverage(value, bufferName, maxItems = 60, precision = 1000) {
  if (!client.getAverage) client.getAverage = {}
  var _ = client.getAverage
  if (!_[bufferName]) _[bufferName] = []
  _[bufferName].push(value)
  if (_[bufferName].length > maxItems) _[bufferName].shift()
  var total = _[bufferName].reduce((total, value) => {
    return total + value
  }, 0)
  var average = total / _[bufferName].length
  return Math.round(average * precision) / precision
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
  if (district) {
    queuedDistrict = receivedDistrict
    if (!client.synced) {
      client.tick = district.tick
      client.synced = true
    }
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
