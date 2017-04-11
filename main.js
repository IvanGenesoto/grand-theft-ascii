var $car = document.createElement('h1')
$car.textContent = 'o=o'
$car.setAttribute('id', 'car')
document.body.appendChild($car)

var $truck = document.createElement('h1')
$truck.textContent = '=o=[]o'
$truck.setAttribute('id', 'truck')
document.body.appendChild($truck)

var $bus = document.createElement('h1')
$bus.textContent = '[o===o]'
$bus.setAttribute('id', 'bus')
document.body.appendChild($bus)

var $walk = document.createElement('h1')
$walk.textContent = 'i'
$walk.setAttribute('id', 'walk')
document.body.appendChild($walk)

var $bugatti = document.createElement('h1')
$bugatti.textContent = 'O==o'
$bugatti.setAttribute('id', 'bugatti')
document.body.appendChild($bugatti)

class Vehicle {
  constructor(location, direction, speed, marker) {
    this.direction = direction
    this.speed = speed
    this.marker = marker
    this.location = location
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
    if (this.marker === $walk && this.speed > 2) return
    else if (this.marker === $bus && this.speed > 4) return
    else if (this.marker === $truck && this.speed > 7) return
    else this.speed += 1
  }
  decelerate() {
    if (this.speed >= 1) {
      this.speed -= 1
    }
  }
  updateLocation() {
    if (this.direction === 'north') {
      this.location.top -= this.speed
      this.marker.style.top = this.location.top + 'px'
    }
    if (this.direction === 'south') {
      this.location.top += this.speed
      this.marker.style.top = this.location.top + 'px'
    }
    if (this.direction === 'east') {
      this.location.left += this.speed
      this.marker.style.left = this.location.left + 'px'
    }
    if (this.direction === 'west') {
      this.location.left -= this.speed
      this.marker.style.left = this.location.left + 'px'
    }
  }
  start() {
    this.marker.style.left = this.location.left + 'px'
    this.marker.style.top = this.location.top + 'px'
  }
}

class SuperCar extends Vehicle {
  accelerate() {
    this.speed += 3
  }
}

var car = new Vehicle({left: 250, top: 400}, 'east', 0, $car)
var truck = new Vehicle({left: 500, top: 500}, 'east', 0, $truck)
var bus = new Vehicle({left: 400, top: 200}, 'east', 0, $bus)
var walk = new Vehicle({left: 350, top: 350}, 'east', 0, $walk)
var bugatti = new SuperCar({left: 100, top: 100}, 'east', 0, $bugatti)

car.start()
truck.start()
bus.start()
walk.start()
bugatti.start()

var currentVehicle = walk

setInterval(function () {
  function hijack(vehicle, vehicleWidth) {
    if (
      currentVehicle === walk && (
        walk.location.left > vehicle.location.left + 15 &&
        walk.location.left < vehicle.location.left + vehicleWidth &&
        walk.location.top > vehicle.location.top - 15 &&
        walk.location.top < vehicle.location.top + 15
      )
    ) {
      currentVehicle = vehicle
      walk.setSpeed(0)
      $walk.classList.add('hidden')
    }
  }
  car.updateLocation()
  truck.updateLocation()
  bus.updateLocation()
  walk.updateLocation()
  bugatti.updateLocation()
  hijack(car, 40)
  hijack(truck, 80)
  hijack(bus, 120)
  hijack(bugatti, 80)
}, 42)

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
      currentVehicle.accelerate()
    }
    if (event.key === '-' || event.key === 'd') {
      currentVehicle.decelerate()
    }
  }
  function getOut(vehicle, vehicleWidth) {
    if (
      currentVehicle === vehicle &&
      vehicle.getSpeed() === 0 &&
      event.key === ' '
    ) {
      walk.location.left = currentVehicle.location.left + vehicleWidth / 2
      walk.location.top = currentVehicle.location.top + 16
      walk.direction = currentVehicle.direction
      walk.start()
      currentVehicle = walk
      $walk.classList.remove('hidden')
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
  controlVehicle()
  getOut(car, 40)
  getOut(truck, 80)
  getOut(bus, 120)
  getOut(bugatti, 80)
})
