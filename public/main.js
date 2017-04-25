/* global io */

var socket = io()

var imagesTotal = 0
var imagesLoaded = 0
var backgroundY = 0
var upToDate = false
var load = {}
// var stopUpdtatingDistrict = false

var timestamp = 1 // eslint-disable-line no-unused-vars
var tick = 1 // eslint-disable-line no-unused-vars

var inputBuffer = []

var player = {}

var camera = {
  following: 0,
  room: 0,
  x: 0,
  y: 0,
  element: 'canvas',
  elementID: 'id0',
  width: 1920,
  height: 1080
}

var queuedDistrict = {}

var district = {}

function checkDistrictPopulated() {
  if (district.characters) {
    createElements(camera)
    createElements(district, true)
    checkImagesLoaded()
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
        $element.src = object.src
        imagesTotal += 1
        $element.onload = function () {
          imagesLoaded += 1
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
  if (imagesLoaded === imagesTotal) {
    composeBackgrounds()
  }
  else {
    setTimeout(checkImagesLoaded, 50)
  }
}

function checkNewImagesLoaded(object) {
  console.log('checking');
  if (imagesLoaded === imagesTotal) {
    // object.load = false
  }
  else {
    setTimeout(() => {
      checkNewImagesLoaded(object)
    }, 50)
  }
}

function composeBackgrounds() {
  loopThrough(district.backgrounds, loopThroughSections)
  loopThrough(district.backgrounds, drawToDistrict)
  startGame()
}

function loopThrough(objects, callback) {
  for (var property in objects) {
    var object = objects[property]
    backgroundY = 0
    callback(object, district)
  }
}

function loopThroughSections(background) {
  for (var property in background.sections) {
    var section = background.sections[property]
    var rows = section.rows
    createOptionsArray(section, rows, background)
  }
}

function createOptionsArray(section, rows, background) {
  var optionsArray = []
  var options = section.options
  for (var property in options) {
    var option = options[property]
    for (var i = 0; i < option.prevalence; i++) {
      optionsArray.push(option)
    }
  }
  chooseFromOptionsArray(optionsArray, rows, background)
}

function chooseFromOptionsArray(optionsArray, rows, background) {
  var rowsDrawn = 0
  function startRow() {
    var x = 0
    var rowY = 0
    function chooseOption() {
      if (x < background.width) {
        var index = Math.floor(Math.random() * optionsArray.length)
        var option = optionsArray[index]
        option.x = x
        option.y = backgroundY
        x += option.width
        rowY = option.height
        drawToDistrict(option, background)
        chooseOption()
      }
      else {
        rowsDrawn += 1
        backgroundY += rowY
        startRow()
      }
    }
    if (rowsDrawn < rows) {
      chooseOption()
    }
  }
  startRow()
}

function drawToDistrict(image, canvas) {
  var $image = document.getElementById(image.elementID)
  var $canvas = document.getElementById(canvas.elementID)
  var context = $canvas.getContext('2d')
  context.drawImage($image, 0, 0, image.width, image.height,
    image.x, image.y, image.width, image.height)
}

function startGame() {
  setInterval(refreshGame, 33)
}

function refreshGame() {
  if (/* !stopUpdtatingDistrict && */ !upToDate) { updateDistrict()
    // var queuedCharacter = queuedDistrict.characters['1']
    // var character = district.characters['1']
    // character.x = queuedCharacter.x
    // character.y = queuedCharacter.y
    // updateDistrict()
  }
  sendInput()
  updateInputBuffer()
  updateCharacter()
  updateCamera()
  renderDistrict()
  loopThrough(district.vehicles, render)
  loopThrough(district.characters, render)
  // loopThrough(district.characters, checkForNewCharacters)
}

function updateDistrict() {
  var characterID = player.character
  if (district.characters) {
    var character = district.characters[characterID]
    var clientCharacter = Object.assign({}, character)
    district = queuedDistrict
    if (clientCharacter.x !== character.x) {
      reconcileCharacter()
    }
    inputBuffer = []
    upToDate = true
    // stopUpdtatingDistrict = true
  }
}

function reconcileCharacter() {
  console.log('Reconcile character.')
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
  inputBuffer.push(player.input)
}

function updateCharacter() {
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
  if (character.speed > 0) {
    if (character.direction === 'left') {
      character.x -= character.speed
    }
    if (character.direction === 'right') {
      character.x += character.speed
    }
    var value = character.x
    var min = character.width
    var max = district.width - character.width
    character.x = keepCharacterInDistrict(value, min, max)
  }
}

function keepCharacterInDistrict(value, min, max) {
  if (value < min) return min
  else if (value > max) return max
  else return value
}

function updateCamera() {
  if (camera.following) {
    var characterID = camera.following
    var character = district.characters[characterID]
    var x = character.x
    var y = character.y
    var cameraX = x - camera.width / 2
    var cameraY = y - camera.height / 2
    var cameraMaxX = district.width - camera.width
    var cameraMaxY = district.height - camera.height
    var cameraMinX = 0
    var cameraMinY = 0
    camera.x = keepCameraInDistrict(cameraX, cameraMinX, cameraMaxX)
    camera.y = keepCameraInDistrict(cameraY, cameraMinY, cameraMaxY)
  }
}

function keepCameraInDistrict(value, min, max) {
  if (value < min) return min
  else if (value > max) return max
  else return value
}

function renderDistrict() {
  var $district = document.getElementById(district.elementID)
  var $camera = document.getElementById(camera.elementID)
  var context = $camera.getContext('2d')
  context.setTransform(1, 0, 0, 1, 0, 0)
  context.clearRect(0, 0, camera.width, camera.height)
  context.drawImage($district, camera.x, camera.y, camera.width,
    camera.height, 0, 0, camera.width, camera.height)
}

function render(object) {
  // if (!object.load) {
    var $object = document.getElementById(object.elementID)
    var $camera = document.getElementById(camera.elementID)
    var context = $camera.getContext('2d')
    context.setTransform(1, 0, 0, 1, 0, 0)
    var xInCamera = object.x - camera.x
    var yInCamera = object.y - camera.y
    if (object.direction) {
      if (object.direction === 'left') {
        xInCamera = -object.x + camera.x - object.width / 2
        context.scale(-1, 1)
      }
    }
    context.drawImage($object, xInCamera, yInCamera)
  // }
}

function checkForNewCharacters(character) {
  if (character.load) createElements(character)
  character.load = false
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
  console.log('got character');
  createElements(character)
  // checkNewImagesLoaded(character)
})

socket.on('request-token', () => {
  var token = player.token
  socket.emit('token', token)
})

socket.on('district', receivedDistrict => {
  var timestamp = receivedDistrict.timestamp
  socket.emit('timestamp', timestamp)
  if (district.characters) {
    queuedDistrict = receivedDistrict
    upToDate = false
  }
  else {
    district = receivedDistrict
    upToDate = true
  }
})

camera.width = window.innerWidth
camera.height = window.innerHeight

checkDistrictPopulated()
