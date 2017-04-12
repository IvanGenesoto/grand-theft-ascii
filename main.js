var accelerating = false
var decelerating = false
var lines = []
var horizontalLinePositions = [50, 150, 250, 350, 450, 550, 650]
var verticalLinePositions = [-300, -200, -100, 0, 100, 200, 300]
var graph = document.querySelector('#graph')

horizontalLinePositions.forEach(position => {
  var line = document.createElement('hr')
  line.classList.add('horizontal-line')
  line.style.top = position + 'px'
  graph.appendChild(line)
  lines.push(line)
})

verticalLinePositions.forEach(position => {
  var line = document.createElement('hr')
  line.classList.add('vertical-line')
  line.style.left = position + 'px'
  graph.appendChild(line)
  lines.push(line)
})

class Vehicle {
  constructor(name, ascii, location, direction, speed) {
    this.direction = direction
    this.speed = speed
    this.location = location
    this.width = ascii.east.length * 20
    this.markerEast = document.createElement('h1')
    this.markerEast.textContent = ascii.east
    var idEast = name + '-east'
    this.markerEast.setAttribute('id', idEast)
    graph.appendChild(this.markerEast)
    this.markerEast.classList.add('vehicle')
    this.markerWest = document.createElement('h1')
    this.markerWest.textContent = ascii.west
    var idWest = name + '-west'
    this.markerWest.setAttribute('id', idWest)
    this.markerWest.classList.add('vehicle')
    graph.appendChild(this.markerWest)
    if (direction === 'east') {
      this.markerWest.classList.add('hidden')
    }
    else this.markerEast.classList.add('hidden')
    this.markerEast.style.left = this.location.left + 'px'
    this.markerWest.style.left = this.location.left + 'px'
    this.markerEast.style.top = this.location.top + 'px'
    this.markerWest.style.top = this.location.top + 'px'
  }
  getDirection() {
    return this.direction
  }
  setDirection(newDirection) {
    this.direction = newDirection
  }
  getSpeed() {
    return this.speed
  }
  setSpeed(newSpeed) {
    this.speed = newSpeed
  }
  accelerate() {
    if (this.markerEast.getAttribute('id') === 'walk-east' && this.speed > 2) return
    else if (this.markerEast.getAttribute('id') === 'bus-east' && this.speed > 4) return
    else if (this.markerEast.getAttribute('id') === 'truck-east' && this.speed > 7) return
    else if (this.markerEast.getAttribute('id') === 'car-east' && this.speed > 11) return
    else this.speed += 1
  }
  decelerate() {
    if (this.markerEast.getAttribute('id') === 'walk-east' && this.speed > 0) this.speed = 0
    else if (this.markerEast.getAttribute('id') === 'bus-east' && this.speed > 0) this.speed -= 1
    else if (this.markerEast.getAttribute('id') === 'truck-east') {
      if (this.speed === 0 || this.speed === 1) this.speed = 0
      else if (this.speed === 2) this.speed = 1
      else this.speed -= 2
    }
    else if (this.markerEast.getAttribute('id') === 'car-east') {
      if (this.speed > -1 && this.speed < 3) this.speed = 0
      else if (this.speed === 3) this.speed = 1
      else this.speed -= 3
    }
    else if (this.markerEast.getAttribute('id') === 'bugatti-east') {
      if (this.speed > -1 && this.speed < 7) this.speed = 0
      else if (this.speed > 6 && this.speed < 30) this.speed -= 7
      else this.speed -= 14
    }
  }
  updateLocation(filteredVehicles) {
    function getTop(line) {
      for (var i = 0; i < line.style.top.length; i++) {
        if (line.style.top[i] === 'p') {
          return +line.style.top.substring(0, i)
        }
      }
    }
    function getLeft(line) {
      for (var i = 0; i < line.style.left.length; i++) {
        if (line.style.left[i] === 'p') {
          return +line.style.left.substring(0, i)
        }
      }
    }
    if (this.direction === 'north') {
      lines.forEach(line => {
        var top = getTop(line)
        top += currentVehicle.speed
        if (top >= 700) top -= 700
        line.style.top = top + 'px'
      })
      filteredVehicles.forEach(function (vehicle) {
        vehicle.location.top += currentVehicle.speed
        vehicle.markerEast.style.top = vehicle.location.top + 'px'
        vehicle.markerWest.style.top = vehicle.location.top + 'px'
      })
    }
    if (this.direction === 'south') {
      lines.forEach(line => {
        var top = getTop(line)
        top -= currentVehicle.speed
        if (top <= 0) top += 700
        line.style.top = top + 'px'
      })
      filteredVehicles.forEach(function (vehicle) {
        vehicle.location.top -= currentVehicle.speed
        vehicle.markerEast.style.top = vehicle.location.top + 'px'
        vehicle.markerWest.style.top = vehicle.location.top + 'px'
      })
    }
    if (this.direction === 'east') {
      lines.forEach(line => {
        var left = getLeft(line)
        left -= currentVehicle.speed
        if (left <= -350) left += 700
        line.style.left = left + 'px'
      })
      this.markerEast.classList.remove('hidden')
      this.markerWest.classList.add('hidden')
      filteredVehicles.forEach(function (vehicle) {
        vehicle.location.left -= currentVehicle.speed
        vehicle.markerEast.style.left = vehicle.location.left + 'px'
        vehicle.markerWest.style.left = vehicle.location.left + 'px'
      })
    }
    if (this.direction === 'west') {
      lines.forEach(line => {
        var left = getLeft(line)
        left += currentVehicle.speed
        if (left >= 350) left -= 700
        line.style.left = left + 'px'
      })
      this.markerEast.classList.add('hidden')
      this.markerWest.classList.remove('hidden')
      filteredVehicles.forEach(function (vehicle) {
        vehicle.location.left += currentVehicle.speed
        vehicle.markerEast.style.left = vehicle.location.left + 'px'
        vehicle.markerWest.style.left = vehicle.location.left + 'px'
      })
    }
  }
}

function move(filteredVehicles) {
  filteredVehicles.forEach(vehicle => {
    if (vehicle.direction === 'north') {
      vehicle.location.top -= vehicle.speed
      vehicle.markerEast.style.top = vehicle.location.top + 'px'
      vehicle.markerWest.style.top = vehicle.location.top + 'px'
    }
    if (vehicle.direction === 'south') {
      vehicle.location.top += vehicle.speed
      vehicle.markerEast.style.top = vehicle.location.top + 'px'
      vehicle.markerWest.style.top = vehicle.location.top + 'px'
    }
    if (vehicle.direction === 'east') {
      vehicle.location.left += vehicle.speed
      vehicle.markerEast.style.left = vehicle.location.left + 'px'
      vehicle.markerWest.style.left = vehicle.location.left + 'px'
    }
    if (vehicle.direction === 'west') {
      vehicle.location.left -= vehicle.speed
      vehicle.markerEast.style.left = vehicle.location.left + 'px'
      vehicle.markerWest.style.left = vehicle.location.left + 'px'
    }
  })
}

class SuperCar extends Vehicle {
  accelerate() {
    this.speed += 3
  }
}

function filterVehicles() {
  var filteredVehicles = vehicles.filter(function (vehicle) {
    return vehicle !== currentVehicle
  })
  return filteredVehicles
}

var car = new Vehicle('car', {east: 'o=o.', west: '.o=o'}, {left: 250, top: 400}, 'east', 3)
var truck = new Vehicle('truck', {east: '=o=[]o', west: 'o[]=o='}, {left: 500, top: 500}, 'south', 2)
var bus = new Vehicle('bus', {east: '[o===o].', west: '.[o===o]'}, {left: 400, top: 200}, 'west', 1)
var walk = new Vehicle('walk', {east: 'i', west: 'i'}, {left: 345, top: 327}, 'east', 0)
var bugatti = new SuperCar('bugatti', {east: '\'O=o.', west: '.o=O\''}, {left: 100, top: 100}, 'east', 5)

var vehicles = [car, bus, truck, bugatti]

var currentVehicle = walk

function hijack(filteredVehicles) {
  var hijacked = false
  vehicles.forEach(function (vehicle) {
    if (
      currentVehicle === walk &&
      walk.location.left > vehicle.location.left + 15 &&
      walk.location.left < vehicle.location.left + vehicle.width - 15 &&
      walk.location.top > vehicle.location.top - 15 &&
      walk.location.top < vehicle.location.top + 15
    ) {
      hijacked = true
      currentVehicle = vehicle
      walk.setSpeed(0)
      var $walkEast = document.querySelector('#walk-east')
      var $walkWest = document.querySelector('#walk-west')
      $walkEast.classList.add('hidden')
      $walkWest.classList.add('hidden')
      var previousTop = currentVehicle.location.top
      var previousLeft = currentVehicle.location.left
      currentVehicle.location.top = 327
      currentVehicle.location.left = 345 - currentVehicle.width / 2
      currentVehicle.markerEast.style.top = currentVehicle.location.top + 'px'
      currentVehicle.markerWest.style.top = currentVehicle.location.top + 'px'
      currentVehicle.markerEast.style.left = currentVehicle.location.left + 'px'
      currentVehicle.markerWest.style.left = currentVehicle.location.left + 'px'
      var filteredVehicles = filterVehicles()
      filteredVehicles.forEach(function (otherVehicle) {
        if (previousTop > vehicle.location.top) {
          otherVehicle.location.top -= previousTop - vehicle.location.top
          otherVehicle.markerEast.style.top = otherVehicle.location.top + 'px'
          otherVehicle.markerWest.style.top = otherVehicle.location.top + 'px'
        }
        if (previousTop < vehicle.location.top) {
          otherVehicle.location.top += vehicle.location.top - previousTop
          otherVehicle.markerEast.style.top = otherVehicle.location.top + 'px'
          otherVehicle.markerWest.style.top = otherVehicle.location.top + 'px'
        }
        if (previousLeft > vehicle.location.left) {
          otherVehicle.location.left -= previousLeft - vehicle.location.left
          otherVehicle.markerEast.style.left = otherVehicle.location.left + 'px'
          otherVehicle.markerWest.style.left = otherVehicle.location.left + 'px'
        }
        if (previousLeft < vehicle.location.left) {
          otherVehicle.location.left += vehicle.location.left - previousLeft
          otherVehicle.markerEast.style.left = otherVehicle.location.left + 'px'
          otherVehicle.markerWest.style.left = otherVehicle.location.left + 'px'
        }
      })
    }
  })
  return hijacked
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
}, 42)

setInterval(function () {
  if (accelerating) currentVehicle.accelerate()
  if (decelerating) currentVehicle.decelerate()
}, 500)

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
    if (event.key === '=' || event.key === 'a') {
      accelerating = true
    }
    if (event.key === '-' || event.key === 'd') {
      decelerating = true
    }
  }
  function getOut(vehicle, vehicleWidth, filteredVehicles) {
    if (
      currentVehicle === vehicle &&
      vehicle.speed === 0 &&
      event.key === ' '
    ) {
      walk.location.top = 327
      walk.location.left = 345
      walk.direction = 'south'
      var previousTop = vehicle.location.top
      var previousLeft = vehicle.location.left
      vehicle.location.top -= 16
      filteredVehicles.forEach(function (otherVehicle) {
        if (previousTop > vehicle.location.top) {
          otherVehicle.location.top -= previousTop - vehicle.location.top
          otherVehicle.markerEast.style.top = otherVehicle.location.top + 'px'
          otherVehicle.markerWest.style.top = otherVehicle.location.top + 'px'
        }
        if (previousTop < vehicle.location.top) {
          otherVehicle.location.top += vehicle.location.top - previousTop
          otherVehicle.markerEast.style.top = otherVehicle.location.top + 'px'
          otherVehicle.markerWest.style.top = otherVehicle.location.top + 'px'
        }
        if (previousLeft > vehicle.location.left) {
          otherVehicle.location.left -= previousLeft - vehicle.location.left
          otherVehicle.markerEast.style.left = otherVehicle.location.left + 'px'
          otherVehicle.markerWest.style.left = otherVehicle.location.top + 'px'
        }
        if (previousLeft < vehicle.location.left) {
          otherVehicle.location.left += vehicle.location.left - previousLeft
          otherVehicle.markerEast.style.left = otherVehicle.location.left + 'px'
          otherVehicle.markerWest.style.left = otherVehicle.location.top + 'px'
        }
      })
      vehicle.markerEast.style.top = vehicle.location.top + 'px'
      vehicle.markerWest.style.top = vehicle.location.top + 'px'
      vehicle.markerEast.style.left = vehicle.location.left + 'px'
      vehicle.markerWest.style.left = vehicle.location.left + 'px'
      walk.markerEast.style.left = walk.location.left + 'px'
      walk.markerWest.style.left = walk.location.left + 'px'
      var $walkEast = document.querySelector('#walk-east')
      var $walkWest = document.querySelector('#walk-west')
      if (walk.direction === 'east') {
        $walkEast.classList.remove('hidden')
      }
      else {
        $walkWest.classList.remove('hidden')
      }
      currentVehicle = walk
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
  getOut(car, 40, filteredVehicles)
  getOut(truck, 80, filteredVehicles)
  getOut(bus, 140, filteredVehicles)
  getOut(bugatti, 80, filteredVehicles)
  controlVehicle()
})

document.body.addEventListener('keyup', function (event) {
  if (event.key === 'a') accelerating = false
  if (event.key === 'd') decelerating = false
})
