/* global io */

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
    loopThrough(district.backgrounds, drawToBackground)
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

function drawToBackground(background) {
  var blueprints = background.blueprints
  blueprints.forEach(blueprint => {
    var sectionID = blueprint.section
    var variationID = blueprint.variation
    var variation = background.sections[sectionID].variations[variationID]
    var $variation = document.getElementById(variation.elementID)
    var $background = document.getElementById(background.elementID)
    var context = $background.getContext('2d')
    context.drawImage($variation, 0, 0, variation.width, variation.height,
      blueprint.x, blueprint.y, variation.width, variation.height)
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
  updateCamera()
  clearCanvas()
  loopThrough(district.backgrounds, renderBackground)
  loopThrough(district.vehicles, render)
  loopThrough(district.characters, render)
  // loopThrough(district.characters, checkForNewCharacters)
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
    character.speed = 12
  }
  else if (input.left === true) {
    character.direction = 'left'
    character.speed = 12
  }
  else character.speed = 0
}

function updateLocation(object) {
  if (object.speed > 0) {
    if (object.direction === 'left') {
      object.x -= object.speed
    }
    if (object.direction === 'right') {
      object.x += object.speed
    }
    var value = object.x
    var min = object.width
    var max = district.width - object.width
    object.x = keepInDistrict(value, min, max)
  }
}

function keepInDistrict(value, min, max) {
  if (value < min) return min
  else if (value > max) return max
  else return value
}

function updateCamera() {
  if (camera.following) {
    var characterID = camera.following
    var character = district.characters[characterID]
    var cameraX = Math.round(character.x - camera.width / 2)
    var cameraY = Math.round(character.y - camera.height / 2)
    var cameraMaxX = district.width - camera.width
    var cameraMaxY = district.height - camera.height
    var cameraMinX = 0
    var cameraMinY = 0
    camera.x = keepInDistrict(cameraX, cameraMinX, cameraMaxX)
    camera.y = keepInDistrict(cameraY, cameraMinY, cameraMaxY)
  }
}

function clearCanvas() {
  var $camera = document.getElementById(camera.elementID)
  var context = $camera.getContext('2d')
  context.clearRect(0, 0, camera.width, camera.height)
}

function renderBackground(background) {
  var characterID = camera.following
  var character = district.characters[characterID]
  var $background = document.getElementById(background.elementID)
  var $camera = document.getElementById(camera.elementID)
  var context = $camera.getContext('2d')
  var cameraX = Math.round(character.x / background.depth - camera.width / 2 / background.depth)
  var cameraMinX = 0
  var cameraMaxX = Math.round(district.width / background.depth - camera.width / background.depth)
  cameraX = keepInDistrict(cameraX, cameraMinX, cameraMaxX)
  context.drawImage($background, cameraX, camera.y, camera.width,
    camera.height, 0, 0, camera.width, camera.height)
}

function render(object) {
  var $object = document.getElementById(object.elementID)
  var $camera = document.getElementById(camera.elementID)
  var context = $camera.getContext('2d')
  context.setTransform(1, 0, 0, 1, 0, 0)
  var xInCamera = object.x - camera.x
  var yInCamera = object.y - camera.y
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
  camera.following = receivedPlayer.id
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
