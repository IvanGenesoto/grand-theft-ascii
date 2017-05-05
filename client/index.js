var io = require('socket.io-client')
var socket = io()

var client = {
  imagesTotal: 0,
  imagesLoaded: undefined,
  upToDate: false,
  timestamp: 1,
  tick: 1
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

var player = {}

var queuedDistrict = {}

var district = {}

function checkDistrictPopulated() {
  if (district.characters) {
    createElements(camera)
    createElements(district, true)
  }
  else {
    setTimeout(checkDistrictPopulated, 50)
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
        client.imagesTotal += 1
        $element.src = object.src
        $element.onload = function () {
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
  if (client.imagesLoaded === client.imagesTotal) {
    loopThrough(district.backgrounds, drawToLayer)
    loopThrough(district.foregrounds, drawToLayer)
    start()
  }
  else {
    setTimeout(checkImagesLoaded, 50)
  }
}

function loopThrough(objects, callback) {
  for (var property in objects) {
    var object = objects[property]
    callback(object)
  }
}

function drawToLayer(layer) {
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

function start() {
  setInterval(refresh, 33)
}

function refresh() {
  if (!client.upToDate) updateDistrict()
  sendInput()
  updateInputBuffer()
  updatePlayerCharacter()
  loopThrough(district.characters, updateLocation)
  loopThrough(district.vehicles, updateVehicleLocation)
  updateCamera()
  clearCanvas()
  loopThrough(district.backgrounds, renderLayer)
  loopThrough(district.characters, render)
  loopThrough(district.vehicles, render)
  loopThrough(district.foregrounds, renderLayer)
}

function updateDistrict() {
  if (district.characters) {
    for (var characterID in district.characters) {
      var character = district.characters[characterID]
      for (var queuedCharacterID in queuedDistrict.characters) {
        var queuedCharacter = queuedDistrict.characters[queuedCharacterID]
        if (characterID === queuedCharacterID) {
          if (character.x !== queuedCharacter.x) {
            reconcileCharacter(characterID)
          }
        }
      }
    }
    district = queuedDistrict
    player.inputBuffer = []
    client.upToDate = true
  }
}

function reconcileCharacter(characterID) {
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

function sendInput() {
  socket.emit('input', player.input)
}

function updateInputBuffer () {
  player.inputBuffer.push(player.input)
}

function updatePlayerCharacter() {
  var input = player.input
  var characterID = player.character
  var character = district.characters[characterID]
  if (input.right === true) {
    character.direction = 'right'
    character.speed = 13
  }
  else if (input.left === true) {
    character.direction = 'left'
    character.speed = 13
  }
  else character.speed = 0
}

function updateLocation(object) {
  if (object.speed > 0) {
    if (object.direction === 'left') {
      object.x -= object.speed
      var nextX = object.x - object.speed
    }
    if (object.direction === 'right') {
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

function updateVehicleLocation(vehicle) {
  if (vehicle.speed > 0) {
    if (vehicle.direction === 'left') {
      vehicle.x -= vehicle.speed
      var nextX = vehicle.x - vehicle.speed
    }
    else if (vehicle.direction === 'right') {
      vehicle.x += vehicle.speed
      nextX = vehicle.x + vehicle.speed
    }
    var min = 0
    var max = district.width - vehicle.width
    if (nextX < min) {
      vehicle.direction = 'right'
    }
    else if (nextX > max) {
      vehicle.direction = 'left'
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

function renderLayer(layer) {
  var characterID = camera.following
  var character = district.characters[characterID]
  var $layer = document.getElementById(layer.elementID)
  var $camera = document.getElementById(camera.elementID)
  var context = $camera.getContext('2d')
  if (layer.x) var layerX = layer.x
  else layerX = 0
  var cameraX = Math.round(character.x / layer.depth - camera.width / 2 / layer.depth - layerX)
  var cameraMaxX = Math.round(district.width / layer.depth - camera.width / layer.depth - layerX)
  if (!layer.x) {
    if (cameraX < 0) cameraX = 0
    if (cameraX > cameraMaxX) cameraX = cameraMaxX
  }
  if (layer.x) {
    if ((layer.x && layer.id === 2) || (layer.x && layer.id === 6)) {
      if (cameraX > cameraMaxX) cameraX = cameraMaxX
    }
  }
  context.drawImage($layer, cameraX, camera.y, camera.width,
    camera.height, 0, 0, camera.width, camera.height)
  context.setTransform(1, 0, 0, 1, 0, 0)
}

function render(object) {
  var $object = document.getElementById(object.elementID)
  var $camera = document.getElementById(camera.elementID)
  var context = $camera.getContext('2d')
  var xInCamera = object.x - camera.x
  var yInCamera = object.y - camera.y
  if (
    xInCamera > camera.width ||
    xInCamera < 0 ||
    yInCamera > camera.height ||
    yInCamera < 0
  ) return
  if (object.direction) {
    if (object.direction === 'left') {
      xInCamera = Math.round(-object.x + camera.x - object.width / 2)
      context.scale(-1, 1)
    }
  }
  context.drawImage($object, xInCamera, yInCamera)
  context.setTransform(1, 0, 0, 1, 0, 0)
}

window.addEventListener('resize', () => {
  if (document.getElementById(camera.elementID)) {
    var $camera = document.getElementById(camera.elementID)
    camera.width = window.innerWidth
    camera.height = window.innerHeight
    $camera.width = window.innerWidth
    $camera.height = window.innerHeight
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
  client.socket.emit('token', token)
})

socket.on('district', receivedDistrict => {
  var timestamp = receivedDistrict.timestamp
  socket.emit('timestamp', timestamp)
  if (district.characters) {
    queuedDistrict = receivedDistrict
    client.upToDate = false
  }
  else {
    district = receivedDistrict
    client.upToDate = true
  }
})

camera.width = window.innerWidth
camera.height = window.innerHeight

checkDistrictPopulated()
checkImagesLoaded()
