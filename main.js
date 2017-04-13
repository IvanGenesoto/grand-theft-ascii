var accelerating = false
var decelerating = false
var distanceTraveledTop = 0
var distanceTraveledLeft = 0
var horizontalLines = []
var verticalLines = []
var vehicles = []

function createLines() {
  var horizontalLinePositions = [21700, 21800, 21900, 22000, 22100, 22200, 22300]
  var verticalLinePositions = [21350, 21450, 21550, 21650, 21750, 21850, 21950]
  var graph = document.querySelector('#graph')
  horizontalLinePositions.forEach(position => {
    var line = document.createElement('hr')
    line.classList.add('horizontal-line')
    line.style.top = position + 'px'
    line.style.left = 21650 + 'px'
    graph.appendChild(line)
    horizontalLines.push(line)
  })
  verticalLinePositions.forEach(position => {
    var line = document.createElement('hr')
    line.classList.add('vertical-line')
    line.style.left = position + 'px'
    line.style.top = 22000 + 'px'
    graph.appendChild(line)
    verticalLines.push(line)
  })
}

class Vehicle {
  constructor(ascii, location, direction, speed, maxSpeed, acceleration, deceleration, color) {
    this.ascii = ascii
    this.location = location
    this.direction = direction
    this.speed = speed
    this.maxSpeed = maxSpeed
    this.acceleration = acceleration
    this.deceleration = deceleration
    this.color = color
    this.$element = document.createElement('h2')
    this.$element.classList.add('vehicle')
    this.$element.textContent = ascii
    var graph = document.querySelector('#graph')
    graph.appendChild(this.$element)
    this.$element.style.left = this.location.left + 'px'
    this.$element.style.top = this.location.top + 'px'
    this.$element.style.color = color

    var canvas = document.createElement('canvas')
    canvas.classList.add('vehicle')
    var context = canvas.getContext('2d')
    var text = context.measureText(ascii)
    this.width = text.width * 4

    if (direction === 'west') {
      this.$element.classList.add('flip')
    }
    else if (direction === 'north') {
      var east = Math.floor(Math.random() * 2)
      if (east) {
        this.$element.classList.add('counter-clockwise')
      }
      else {
        this.$element.classList.add('flip')
        this.$element.classList.add('clockwise')
      }
    }
    else {
      east = Math.floor(Math.random() * 2)
      if (east) {
        this.$element.classList.add('clockwise')
      }
      else {
        this.$element.classList.add('flip')
        this.$element.classList.add('counter-clockwise')
      }
    }
  }
  setDirection(newDirection) {
    this.direction = newDirection
  }
  setSpeed(newSpeed) {
    this.speed = newSpeed
  }
  accelerate() {
    var accelerationPercentage = this.acceleration / 10000
    if (this.speed <= this.maxSpeed - this.maxSpeed * accelerationPercentage) {
      this.speed += this.maxSpeed * accelerationPercentage
    }
    else this.speed = this.maxSpeed
  }
  decelerate() {
    var decelerationPercentage = this.deceleration / 3333.3333
    if (this.speed >= this.maxSpeed * decelerationPercentage) {
      this.speed -= this.maxSpeed * decelerationPercentage
    }
    else this.speed = 0
  }
  updateLocation(filteredVehicles, stepped) {
    if (stepped === 'out') var step = 16
    else step = 0
    if (this.direction === 'north') {
      distanceTraveledTop -= this.speed
      if (distanceTraveledTop <= -11000) this.direction = 'south'
      horizontalLines.forEach(line => {
        var top = removePXFromTop(line)
        top += currentVehicle.speed
        if (top >= 22350) top -= 700
        line.style.top = top + 'px'
      })
      if (this.$element.classList.contains('flip')) {
        this.$element.classList.add('clockwise')
        this.$element.classList.remove('counter-clockwise')
      }
      else {
        this.$element.classList.add('counter-clockwise')
        this.$element.classList.remove('clockwise')
      }
      filteredVehicles.forEach(function (vehicle) {
        vehicle.location.top += currentVehicle.speed
        vehicle.$element.style.top = vehicle.location.top + 'px'
      })
    }
    if (this.direction === 'south') {
      distanceTraveledTop += this.speed + step
      if (distanceTraveledTop >= 11000) this.direction = 'north'
      horizontalLines.forEach(line => {
        var top = removePXFromTop(line)
        top -= currentVehicle.speed + step
        if (top <= 21650) top += 700
        line.style.top = top + 'px'
      })
      if (this.$element.classList.contains('flip')) {
        this.$element.classList.add('counter-clockwise')
        this.$element.classList.remove('clockwise')
      }
      else {
        this.$element.classList.add('clockwise')
        this.$element.classList.remove('counter-clockwise')
      }
      filteredVehicles.forEach(function (vehicle) {
        vehicle.location.top -= currentVehicle.speed + step
        vehicle.$element.style.top = vehicle.location.top + 'px'
      })
    }
    if (this.direction === 'east') {
      distanceTraveledLeft += this.speed
      if (distanceTraveledLeft >= 11000) this.direction = 'west'
      verticalLines.forEach(line => {
        var left = removePXFromLeft(line)
        left -= currentVehicle.speed
        if (left <= 21300) left += 700
        line.style.left = left + 'px'
      })
      this.$element.classList.remove('clockwise', 'counter-clockwise', 'flip')
      filteredVehicles.forEach(function (vehicle) {
        vehicle.location.left -= currentVehicle.speed
        vehicle.$element.style.left = vehicle.location.left + 'px'
      })
    }
    if (this.direction === 'west') {
      distanceTraveledLeft -= this.speed
      if (distanceTraveledLeft <= -11000) this.direction = 'east'
      verticalLines.forEach(line => {
        var left = removePXFromLeft(line)
        left += currentVehicle.speed
        if (left >= 22000) left -= 700
        line.style.left = left + 'px'
      })
      this.$element.classList.remove('clockwise', 'counter-clockwise')
      this.$element.classList.add('flip')
      filteredVehicles.forEach(function (vehicle) {
        vehicle.location.left += currentVehicle.speed
        vehicle.$element.style.left = vehicle.location.left + 'px'
      })
    }
  }
}

class Person extends Vehicle {
  straighten() {
    this.$element.classList.remove('clockwise', 'counter-clockwise')
  }
  decelerate() {
    this.speed = 0
  }
  accelerate() {
    if (this.speed === 0) this.speed = 3
    if (this.speed === 3) this.speed = 6
  }
}

class SuperCar extends Vehicle { // eslint-disable-line no-unused-vars
  accelerate() {
    this.speed += 3
  }
}

function removePXFromTop(line) {
  for (var i = 0; i < line.style.top.length; i++) {
    if (line.style.top[i] === 'p') {
      return +line.style.top.substring(0, i)
    }
  }
}
function removePXFromLeft(line) {
  for (var i = 0; i < line.style.left.length; i++) {
    if (line.style.left[i] === 'p') {
      return +line.style.left.substring(0, i)
    }
  }
}

function move(filteredVehicles) {
  filteredVehicles.forEach(vehicle => {
    if (vehicle.direction === 'north') {
      if (vehicle.location.top <= 11000 - distanceTraveledTop) {
        vehicle.direction = 'south'
      }
      if (vehicle.$element.classList.contains('flip')) {
        vehicle.$element.classList.add('clockwise')
        vehicle.$element.classList.remove('counter-clockwise')
      }
      else {
        vehicle.$element.classList.add('counter-clockwise')
        vehicle.$element.classList.remove('clockwise')
      }
      vehicle.location.top -= vehicle.speed
      vehicle.$element.style.top = vehicle.location.top + 'px'
    }
    if (vehicle.direction === 'south') {
      if (vehicle.location.top >= 33000 - distanceTraveledTop) {
        vehicle.direction = 'north'
      }
      if (vehicle.$element.classList.contains('flip')) {
        vehicle.$element.classList.add('counter-clockwise')
        vehicle.$element.classList.remove('clockwise')
      }
      else {
        vehicle.$element.classList.add('clockwise')
        vehicle.$element.classList.remove('counter-clockwise')
      }
      vehicle.location.top += vehicle.speed
      vehicle.$element.style.top = vehicle.location.top + 'px'
    }
    if (vehicle.direction === 'east') {
      if (vehicle.location.left >= 33000 - distanceTraveledLeft) {
        vehicle.direction = 'west'
      }
      vehicle.$element.classList.remove('clockwise', 'counter-clockwise', 'flip')
      vehicle.location.left += vehicle.speed
      vehicle.$element.style.left = vehicle.location.left + 'px'
    }
    if (vehicle.direction === 'west') {
      if (vehicle.location.left <= 11000 - distanceTraveledLeft) {
        vehicle.direction = 'east'
      }
      vehicle.$element.classList.remove('clockwise', 'counter-clockwise')
      vehicle.$element.classList.add('flip')
      vehicle.location.left -= vehicle.speed
      vehicle.$element.style.left = vehicle.location.left + 'px'
    }
  })
}

function turn(filteredVehicles) {
  filteredVehicles.forEach(vehicle => {
    if (vehicle.speed > 0) {
      var turn = Math.floor(Math.random() * 1.004)
      if (turn) {
        if (vehicle.direction === 'north' || vehicle.direction === 'south') {
          var directions = ['east', 'west']
        }
        else if (vehicle.direction === 'east' || vehicle.direction === 'west') {
          directions = ['north', 'south']
        }
        var directionIndex = Math.floor(Math.random() * directions.length)
        vehicle.direction = directions[directionIndex]
      }
    }
  })
}

function hijack(filteredVehicles) {
  var hijacked = false
  vehicles.forEach(function (vehicle) {
    if (
      currentVehicle === walk &&
      walk.location.left > vehicle.location.left + 22 &&
      walk.location.left < vehicle.location.left + vehicle.width - 22 &&
      walk.location.top > vehicle.location.top - 15 &&
      walk.location.top < vehicle.location.top + 15
    ) {
      hijacked = true
      currentVehicle = vehicle
      walk.setSpeed(0)
      walk.$element.classList.add('hidden')
      var previousTop = currentVehicle.location.top
      var previousLeft = currentVehicle.location.left
      currentVehicle.location.top = 22000
      currentVehicle.location.left = 22000 - currentVehicle.width / 2
      currentVehicle.$element.style.top = currentVehicle.location.top + 'px'
      currentVehicle.$element.style.left = currentVehicle.location.left + 'px'
      var filteredVehicles = filterVehicles()
      filteredVehicles.forEach(function (otherVehicle) {
        if (previousTop > vehicle.location.top) {
          otherVehicle.location.top -= previousTop - vehicle.location.top
          otherVehicle.$element.style.top = otherVehicle.location.top + 'px'
        }
        if (previousTop < vehicle.location.top) {
          otherVehicle.location.top += vehicle.location.top - previousTop
          otherVehicle.$element.style.top = otherVehicle.location.top + 'px'
        }
        if (previousLeft > vehicle.location.left) {
          otherVehicle.location.left -= previousLeft - vehicle.location.left
          otherVehicle.$element.style.left = otherVehicle.location.left + 'px'
        }
        if (previousLeft < vehicle.location.left) {
          otherVehicle.location.left += vehicle.location.left - previousLeft
          otherVehicle.$element.style.left = otherVehicle.location.left + 'px'
        }
      })
    }
  })
  return hijacked
}

function filterVehicles() {
  var filteredVehicles = vehicles.filter(function (vehicle) {
    return vehicle !== currentVehicle
  })
  return filteredVehicles
}

setInterval(function () {
  var hijacked = false
  hijacked = hijack()
  if (hijacked === false) {
    var filteredVehicles = filterVehicles()
    currentVehicle.updateLocation(filteredVehicles)
  }
  filteredVehicles = filterVehicles()
  move(filteredVehicles)
  var $mph = document.querySelector('#mph')
  $mph.textContent = 'MPH: ' + Math.floor(currentVehicle.speed * 2)
  turn(filteredVehicles)
  walk.straighten()
}, 42)

setInterval(function () {
  if (accelerating) currentVehicle.accelerate()
  if (decelerating) currentVehicle.decelerate()
}, 42)

function createVehicle() {
  var colors = ['red', 'orange', 'green', 'blue', 'purple', 'black', 'gray', 'brown']
  var colorIndex = Math.floor(Math.random() * colors.length)
  var color = colors[colorIndex]

  var top = Math.floor(Math.random() * (33000 - 11000) + 11000)
  var left = Math.floor(Math.random() * (33000 - 11000) + 11000)

  var directions = ['north', 'south', 'east', 'west']
  var directionIndex = Math.floor(Math.random() * directions.length)
  var direction = directions[directionIndex]

  var Fast = Math.floor(Math.random() * (50 - 21)) + 4
  var Medium = Math.floor(Math.random() * (20 - 11)) + 4
  var Slow = Math.floor(Math.random() * (10 - 4)) + 4
  var isMedium = Math.floor(Math.random() * 2)
  if (isMedium) var maxSpeed = Medium
  else {
    var isFast = Math.floor(Math.random() * 2)
    if (isFast) maxSpeed = Fast
    else maxSpeed = Slow
  }
  var speed = Math.floor(Math.random() * maxSpeed)

  var asciiCharacters = ['=', '=', '=', '#', '#', '@', '[', ']', '(', ')', '{', '}', '|']
  var numberOfASCII = Math.floor(Math.random() * (7 - 1)) + 1
  var asciiCharacterIndexes = []
  for (var i = 0; i < numberOfASCII; i++) {
    var asciiCharacterIndex = Math.floor(Math.random() * asciiCharacters.length)
    asciiCharacterIndexes.push(asciiCharacterIndex)
  }
  var ascii = 'o'
  asciiCharacterIndexes.forEach(asciiCharacterIndex => {
    ascii += asciiCharacters[asciiCharacterIndex]
  })
  ascii += 'o'

  var acceleration = Math.floor(Math.random() * (101 - 30) + 30)
  var deceleration = Math.floor(Math.random() * (101 - 30) + 30)

  var vehicle = new Vehicle(ascii, {top: top, left: left}, direction, speed, maxSpeed, acceleration, deceleration, color)
  vehicles.push(vehicle)
}

document.body.addEventListener('keydown', function (event) {
  function controlVehicle() {
    if (event.key === 'ArrowUp') {
      currentVehicle.setDirection('north')
    }
    if (event.key === 'ArrowDown') {
      currentVehicle.setDirection('south')
    }
    if (event.key === 'ArrowRight') {
      currentVehicle.setDirection('east')
    }
    if (event.key === 'ArrowLeft') {
      currentVehicle.setDirection('west')
    }
    if (event.key === 'a' || event.key === 'A') {
      accelerating = true
    }
    if (event.key === 'd' || event.key === 'D') {
      decelerating = true
    }
  }
  function getOut(filteredVehicles) {
    if (currentVehicle.speed === 0 && event.key === ' ') {
      walk.location.top = 22000
      walk.location.left = 22000
      walk.direction = 'south'
      var previousTop = currentVehicle.location.top
      var previousLeft = currentVehicle.location.left
      filteredVehicles.forEach(function (otherVehicle) {
        if (previousTop > currentVehicle.location.top) {
          otherVehicle.location.top -= previousTop - currentVehicle.location.top
          otherVehicle.$element.style.top = otherVehicle.location.top + 'px'
        }
        if (previousTop < currentVehicle.location.top) {
          otherVehicle.location.top += currentVehicle.location.top - previousTop
          otherVehicle.$element.style.top = otherVehicle.location.top + 'px'
        }
        if (previousLeft > currentVehicle.location.left) {
          otherVehicle.location.left -= previousLeft - currentVehicle.location.left
          otherVehicle.$element.style.left = otherVehicle.location.left + 'px'
        }
        if (previousLeft < currentVehicle.location.left) {
          otherVehicle.location.left += currentVehicle.location.left - previousLeft
          otherVehicle.$element.style.left = otherVehicle.location.left + 'px'
        }
      })
      currentVehicle.$element.style.top = currentVehicle.location.top + 'px'
      currentVehicle.$element.style.left = currentVehicle.location.left + 'px'
      walk.$element.style.left = walk.location.left + 'px'
      walk.$element.style.top = walk.location.top + 'px'
      walk.$element.classList.remove('hidden')
      currentVehicle = walk
      filteredVehicles = filterVehicles()
      walk.updateLocation(filteredVehicles, 'out')
    }
  }
  if (
    event.key === 'ArrowUp' ||
    event.key === 'ArrowDown' ||
    event.key === 'ArrowRight' ||
    event.key === 'ArrowLeft' ||
    event.key === ' '
  ) {
    event.preventDefault()
  }
  var filteredVehicles = filterVehicles()
  getOut(filteredVehicles)
  controlVehicle()
})

document.body.addEventListener('keyup', function (event) {
  if (event.key === 'a') accelerating = false
  if (event.key === 'd') decelerating = false
})

var walk = new Person('i', {left: 22000, top: 22000}, 'east', 0, 6, 50, 100)
new Person('i', {left: 44000, top: 44000}, 'east', 0, 0, 0, 0, 'white') // eslint-disable-line no-new
var currentVehicle = walk
createLines()
for (var i = 0; i < 1000; i++) {
  createVehicle()
}
