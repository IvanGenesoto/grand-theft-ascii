/* global io */

var socket = io()

var imagesTotal = 0
var imagesLoaded = 0
var backgroundY = 0
var upToDate = false
// var stopUpdtatingArea = false

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

var queuedArea = {}

var area = {}

function checkAreaPopulated() {
  if (area.characters) {
    createElements(camera, false)
    createElements(area, true)
    checkImagesLoaded()
  }
  else {
    setTimeout(checkAreaPopulated, 50)
  }
}

function createElements(object, loop) {
  for (var property in object) {
    if (property === 'element') {
      var $element = document.createElement(object.element)
      $element.id = object.elementID
      document.body.appendChild($element)
      if (loop) {
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

function composeBackgrounds() {
  loopThrough(area.backgrounds, loopThroughSections)
  loopThrough(area.backgrounds, drawToArea)
  startGame()
}

function loopThrough(objects, callback) {
  for (var property in objects) {
    if (objects.hasOwnProperty(property)) {
      var object = objects[property]
      backgroundY = 0
      callback(object, area)
    }
  }
}

function loopThroughSections(background) {
  for (var property in background.sections) {
    if (background.sections.hasOwnProperty(property)) {
      var section = background.sections[property]
      var rows = section.rows
      createOptionsArray(section, rows, background)
    }
  }
}

function createOptionsArray(section, rows, background) {
  var optionsArray = []
  var options = section.options
  for (var property in options) {
    if (options.hasOwnProperty(property)) {
      var option = options[property]
      for (var i = 0; i < option.prevalence; i++) {
        optionsArray.push(option)
      }
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
        drawToArea(option, background)
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

function drawToArea(image, canvas) {
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
  if (/* !stopUpdtatingArea && */ !upToDate) updateArea()
  sendInput()
  updateInputBuffer()
  updateCharacter()
  updateCamera()
  renderArea()
  loopThrough(area.vehicles, render)
  loopThrough(area.characters, render)
}

function updateArea() {
  var characterID = player.character
  if (area.characters) {
    var character = area.characters[characterID]
    var clientCharacter = Object.assign({}, character)
    area = queuedArea
    if (clientCharacter !== character) {
      reconcileCharacter()
    }
    inputBuffer = []
    upToDate = true
    // stopUpdtatingArea = true
  }
}

function reconcileCharacter() {
  // Reconcile character.
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
  socket.emit('player', player)
}

function updateInputBuffer () {
  inputBuffer.push(player.input)
}

function updateCharacter() {
  var input = player.input
  var characterID = player.character
  var character = area.characters[characterID]
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
    var max = area.width - character.width
    character.x = keepCharacterInArea(value, min, max)
  }
}

function keepCharacterInArea(value, min, max) {
  if (value < min) return min
  else if (value > max) return max
  else return value
}

function updateCamera() {
  if (camera.following) {
    var characterID = camera.following
    var character = area.characters[characterID]
    var x = character.x
    var y = character.y
    var cameraX = x - camera.width / 2
    var cameraY = y - camera.height / 2
    var cameraMaxX = area.width - camera.width
    var cameraMaxY = area.height - camera.height
    var cameraMinX = 0
    var cameraMinY = 0
    camera.x = keepCameraInArea(cameraX, cameraMinX, cameraMaxX)
    camera.y = keepCameraInArea(cameraY, cameraMinY, cameraMaxY)
  }
}

function keepCameraInArea(value, min, max) {
  if (value < min) return min
  else if (value > max) return max
  else return value
}

function renderArea() {
  var $area = document.getElementById(area.elementID)
  var $camera = document.getElementById(camera.elementID)
  var context = $camera.getContext('2d')
  context.setTransform(1, 0, 0, 1, 0, 0)
  context.clearRect(0, 0, camera.width, camera.height)
  context.drawImage($area, camera.x, camera.y, camera.width,
    camera.height, 0, 0, camera.width, camera.height)
}

function render(object) {
  var $object = document.getElementById(object.elementID)
  var $camera = document.getElementById(camera.elementID)
  var context = $camera.getContext('2d')
  var xInCamera = object.x - camera.x
  var yInCamera = object.y - camera.y
  if (object.direction) {
    if (object.direction === 'left') {
      xInCamera = -object.x + camera.x
      context.scale(-1, 1)
    }
  }
  context.drawImage($object, xInCamera, yInCamera)
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
  camera.follow = player.id
})

socket.on('request-token', () => {
  var token = player.token
  socket.emit('token', token)
})

socket.on('area', function (receivedArea) {
  var timestamp = receivedArea.timestamp
  socket.emit('timestamp', timestamp)
  if (area.characters) {
    queuedArea = receivedArea
    upToDate = false
  }
  else {
    area = receivedArea
    upToDate = true
  }
})

camera.width = window.innerWidth
camera.height = window.innerHeight

checkAreaPopulated()
