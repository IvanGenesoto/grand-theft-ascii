var imagesTotal = 0
var imagesLoaded = 0
var backgroundY = 0
var id = 0

var player = {
  id: 1,
  area: 1,
  character: 1,
  input: {
    up: false,
    down: false,
    left: false,
    right: false,
    accelerate: false,
    decelerate: false,
    shoot: false
  }
}

var camera = {
  following: 1,
  room: 0,
  x: 0,
  y: 0,
  element: 'canvas',
  width: 1920,
  height: 1080
}

var area = {
  id: 1,
  name: 'District 1',
  width: 8000,
  height: 8000,
  element: 'canvas',
  backgrounds: {
    '1': {
      x: 0,
      y: 0,
      element: 'canvas',
      width: 8000,
      height: 8000,
      sections: {
        '1': {
          rows: 1,
          options: {
            '1': {
              x: 0,
              y: 0,
              prevalence: 1,
              element: 'img',
              src: 'images/background/far/above-top.png',
              width: 1024,
              height: 367
            }
          }
        },
        '2': {
          rows: 1,
          options: {
            '1': {
              x: 0,
              y: 0,
              prevalence: 4,
              element: 'img',
              src: 'images/background/far/top/top.png',
              width: 1024,
              height: 260
            },
            '2': {
              x: 0,
              y: 0,
              prevalence: 1,
              element: 'img',
              src: 'images/background/far/top/top-pink-jumbotron-left.png',
              width: 1024,
              height: 260
            },
            '3': {
              x: 0,
              y: 0,
              prevalence: 2,
              element: 'img',
              src: 'images/background/far/top/top-pink-jumbotron-right.png',
              width: 1024,
              height: 260
            }
          }
        },
        section3: {
          rows: 50,
          options: {
            '1': {
              x: 0,
              y: 0,
              prevalence: 3,
              element: 'img',
              src: 'images/background/far/middle/middle.png',
              width: 1024,
              height: 134
            },
            '2': {
              x: 0,
              y: 0,
              prevalence: 2,
              element: 'img',
              src: 'images/background/far/middle/middle-pink-jumbotron-far-left.png',
              width: 1024,
              height: 134
            },
            '3': {
              x: 0,
              y: 0,
              prevalence: 1,
              element: 'img',
              src: 'images/background/far/middle/middle-pink-jumbotron-left.png',
              width: 1024,
              height: 134
            },
            '4': {
              x: 0,
              y: 0,
              prevalence: 1,
              element: 'img',
              src: 'images/background/far/middle/middle-pink-jumbotron-mid-left.png',
              width: 1024,
              height: 134
            },
            '5': {
              x: 0,
              y: 0,
              prevalence: 2,
              element: 'img',
              src: 'images/background/far/middle/middle-pink-jumbotron-middle.png',
              width: 1024,
              height: 134
            },
            '6': {
              x: 0,
              y: 0,
              prevalence: 2,
              element: 'img',
              src: 'images/background/far/middle/middle-pink-jumbotron-right.png',
              width: 1024,
              height: 134
            },
            '7': {
              x: 0,
              y: 0,
              prevalence: 3,
              element: 'img',
              src: 'images/background/far/middle/middle-blue-jumbotron-left.png',
              width: 1024,
              height: 134
            },
            '8': {
              x: 0,
              y: 0,
              prevalence: 2,
              element: 'img',
              src: 'images/background/far/middle/middle-blue-jumbotron-middle.png',
              width: 1024,
              height: 134
            },
            '9': {
              x: 0,
              y: 0,
              prevalence: 3,
              element: 'img',
              src: 'images/background/far/middle/middle-blue-jumbotron-right.png',
              width: 1024,
              height: 134
            }
          }
        },
        '4': {
          rows: 1,
          options: {
            '1': {
              x: 0,
              y: 0,
              prevalence: 1,
              element: 'img',
              src: 'images/background/far/bottom.png',
              width: 1024,
              height: 673
            }
          }
        }
      }
    },
    '2': {
      x: 0,
      y: 7232,
      element: 'canvas',
      width: 16000,
      height: 8000,
      sections: {
        '1': {
          rows: 1,
          options: {
            '1': {
              x: 0,
              y: 0,
              width: 1024,
              height: 768,
              prevalence: 1,
              element: 'img',
              src: 'images/background/middle.png'
            }
          }
        }
      }
    },
    '3': {
      x: 0,
      y: 7232,
      element: 'canvas',
      width: 32000,
      height: 8000,
      sections: {
        '1': {
          rows: 1,
          options: {
            '1': {
              x: 0,
              y: 0,
              width: 1408,
              height: 768,
              prevalence: 1,
              element: 'img',
              src: 'images/background/near.png'
            }
          }
        }
      }
    }
  },
  rooms: {
    room1: {
      id: 1,
      key: '9xn2989n',
      viewingKey: undefined,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      element: 'canvas',
      background: undefined,
      foreground: undefined,
      scenery: {
        background: undefined,
        foreground: undefined
      },
      inventory: undefined
    }
  },
  characters: {
    '1': {
      id: 1,
      name: '',
      room: 0,
      x: 250,
      y: 7832,
      width: 105,
      height: 155,
      keys: [],
      direction: 'east',
      speed: 0,
      maxSpeed: 0,
      acceleration: 0,
      element: 'img',
      src: 'images/characters/man.png'
    }
  },
  aiCharacters: {
    '1': {
      id: 1,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      keys: [],
      direction: 'east',
      speed: 0,
      maxSpeed: 0,
      acceleration: 0,
      frames: {}
    }
  },
  vehicles: {
    '1': {
      id: 1,
      key: '93dufn23',
      x: 450,
      y: 7852,
      width: 268,
      height: 80,
      direction: 'east',
      speed: 0,
      maxSpeed: 0,
      acceleration: 0,
      deceleration: 0,
      armor: undefined,
      weight: 0,
      element: 'img',
      src: 'images/vehicles/delorean.png'
    }
  },
  projectiles: {
    '1': {
      x: 0,
      y: 0,
      classes: [],
      speed: 0,
      type: undefined,
      level: undefined
    }
  },
  scenery: {
    background: {
      '1': {
        x: 0,
        y: 0
      }
    },
    foreground: {
      '1': {
        x: 0,
        y: 0
      }
    }
  }
}

function createElements(object, loop) {
  for (var property in object) {
    if (property === 'element') {
      var $element = document.createElement(object.element)
      id += 1
      object.elementID = 'id' + id
      $element.id = 'id' + id
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
      typeof object[property] !== 'boolean' &&
      typeof object[property] !== undefined
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
  updateCharacterMovement()
  updateCharacterLocation()
  updateCamera()
  renderArea()
  loopThrough(area.vehicles, render)
  loopThrough(area.characters, render)
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

function updateCharacterMovement() {
  var input = player.input
  var characterID = player.id
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
}

function updateCharacterLocation() {
  var characterID = player.id
  var character = area.characters[characterID]
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

window.addEventListener('keydown', event => {
  control(event.key, 'down')
})

window.addEventListener('keyup', event => {
  control(event.key, 'up')
})

createElements(camera, false)
createElements(area, true)
checkImagesLoaded()
