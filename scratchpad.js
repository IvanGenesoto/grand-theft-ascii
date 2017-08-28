const characters = {
  driving: [0, 4]
}

const accessor = Object.create(null, {
  driving: {
    get: function() {
      return characters.driving[this.id]
    }
  }
})

const root = Object.create(null)

Object.defineProperty(root, '1', {
  get: function() {
    accessor.id = 1
    return accessor
  }
})

root[1].driving

const first = characters.create()
first.driving = 234
const driving = first.driving
first.vehicleKeys.add(driving)
first.vehicleKeys.addMultiple(9873, 382, 2)
console.log('vehicleKeys: ', first.vehicleKeys.get());
console.log('total vehicleKeys: ', first.vehicleKeys.length());
const vehicleKeys = first.vehicleKeys
vehicleKeys.removeMultiple(234, 2)
console.log('vehicleKeys: ', first.vehicleKeys.get());
vehicleKeys.removeAll()
console.log('vehicleKeys: ', first.vehicleKeys.get());
vehicleKeys.addMultiple(56, 65)
console.log('vehicleKeys: ', vehicleKeys.get());
vehicleKeys.remove(56)
console.log('vehicleKeys: ', vehicleKeys.get());
vehicleKeys.add(3.2)
console.log('vehicleKeys: ', first.vehicleKeys.get());

function createArrayAttribute(defaultArray) {
  if (Array.isArray(defaultArray[0])) return createGrid()
  else return []
}

function createGrid() {
  var grid = []
  var row = -1
  while (row < 8) {
    var column = -1
    row++
    var rowIndex = getGridIndex(row * 1000)
    grid[rowIndex] = []
    while (column < 32) {
      column += 1
      var columnIndex = getGridIndex(column * 1000)
      grid[rowIndex][columnIndex] = {}
      grid[rowIndex][columnIndex].a = []
      grid[rowIndex][columnIndex].b = []
    }
  }
  return grid
}

function getGridIndex(coordinate) {
  coordinate = Math.round(coordinate)
  coordinate = coordinate.toString()
  var zerosToAdd = 5 - coordinate.length
  var zeros = ''
  while (zerosToAdd > 0) {
    zeros += '0'
    zerosToAdd -= 1
  }
  coordinate = zeros + coordinate
  return coordinate.slice(0, 2)
}


function createArrayAttribute(defaultArray) {
  const newArray = [[]]
  let levelsDeep = 0
  function loopThrough(defaultArray) {
    defaultArray.forEach((nestedArray, index) => {
      if (Array.isArray(nestedArray)) {
        newArray[levelsDeep][index] = []
        levelsDeep++
        loopThrough(nestedArray)
      }
      else levelsDeep--
    })
  }
  loopThrough(defaultArray)
  return newArray[0]
}

function generateFunctionName(attributeName, array) {
  let firstLetter = attributeName.slice(0, 1)
  firstLetter = firstLetter.toUpperCase()
  const rest = attributeName.slice(1)
  if (array) return 'edit' + firstLetter + rest
  else return 'set' + firstLetter + rest
}

giveKey: (characterID, cityElementID, masterKey) => {
  var character = _cityElements[characterID]
  var cityElement = _cityElements[cityElementID]

  var type = cityElement.type

  switch (true) {
    case type === 'vehicle' && masterKey: var keysType = 'vehicleMasterKeys'; break
    case type === 'vehicle': keysType = 'vehicleKeys'; break
    case type === 'room' && masterKey: keysType = 'roomMasterKeys'; break
    case type === 'room': keysType = 'roomKeys'; break
    default:
  }

  var keys = character[keysType]
  var duplicateKey = keys.find(key => key === cityElementID)
  if (!duplicateKey) keys.push(cityElementID)
  if (masterKey) var keyHoldersType = 'masterKeyHolders'
  else keyHoldersType = 'keyHolders'
  var keyHolders = cityElement[keyHoldersType]
  var duplicateKeyHolder = keyHolders.find(keyHolder => keyHolder === characterID)
  if (!duplicateKeyHolder) keyHolders.push(characterID)
  if (masterKey) cityElements.giveKey(characterID, cityElementID)
},



fallVehicle: vehicle => {
  vehicle.y += 2
  if (vehicle.y < 7843) {
    vehicle.falling = false
    vehicle.y = 7843
  }
},




if (type === 'vehicle') {
  var index = Math.floor(Math.random * percentages.length)
  var percentage = percentages[index]
  console.log(percentage);
  cityElement.speed = (speed || speed === 0) ? speed : Math.round(Math.random() * cityElement.maxSpeed * percentage)
}


const speeds = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 0.1, 0.2,
  0.3, 0.4, 0.5, 0.6, 0.1, 0.2, 0.3, 0.4, 0.1, 0.2]




var vehicle =
    if (vehicle.driver) var driver = 1
    else driver = 0
    return (
      character.x < vehicle.x + vehicle.width &&
      character.x + character.width > vehicle.x &&
      character.y < vehicle.y + vehicle.height &&
      character.y + character.height > vehicle.y &&
      driver + vehicle.passengers.length < vehicle.seats
    )
  }
})
if (vehicleID) {
  checked.charactersToEnter.push(characterID)
  checked.vehiclesToBeEntered.push(vehicleID)
}
else {
  checked.nonEntereringWalkers.push(character.id)
}
})




switch (objectType) {
  case 'character':
    var object = {
      ...characterProperties,
      vehicleMasterKeys: [],
      vehicleKeys: [],
      vehicleWelcomes: [],
      roomMasterKeys: [],
      roomKeys: []
    }
    break
  case 'vehicle':
    object = {
      ...vehicleProperties,
      masterKeyHolders: [],
      keyHolders: [],
      welcomes: [],
      passengers: []
    }
    break
  case 'room':
    object = {
      ...roomProperties,
      occupants: [],
      masterKeyHolders: [],
      keyHolders: [],
      unwelcomes: [],
      scenery: {
        background: undefined,
        foreground: undefined
      }
    }
    break
  default:
}





getVehicleIDs: districtID => [..._districts[districtID].vehicles],

getAllVehicleIDs: () => {
  var allVehicleIDs = []
  _districts.forEach(district => {
    var vehicleIDs = districts.getVehicleIDs(district.id)
    allVehicleIDs.push(vehicleIDs)
  })
  return allVehicleIDs
},



const standInCharacter = {
  vehicleMasterKeys: [],
  vehicleKeys: [],
  vehicleWelcomes: [],
  roomMasterKeys: [],
  roomKeys: []
}
const standInVehicle = {
  masterKeyHolders: [],
  keyHolders: [],
  welcomes: [],
  passengers: []
}
const standInRoom = {
  occupants: [],
  masterKeyHolders: [],
  keyHolders: [],
  unwelcomes: []
}

getMultiple: (...ids) => {
  multiple.length = 0
  ids.forEach(id => {
    var object = objects[id]
    multiple.push(object)
  })
  return multiple
},

getAll: () => {
  all.length = 0
  var id = 0
  while (id < _objects.length) {
    all.push(objects[id])
    id++
  }
  return all
},


object: id => {
  var object = _objects[id]
  switch (object.type) {
    case 'character': var standInObject = standInCharacter; break
    case 'vehicle': standInObject = standInVehicle; break
    case 'room': standInObject = standInRoom; break
    default: standInObject = standInRoom
  }

  for (var property in object) {
    var value = object[property]
    if (typeof value !== 'object' || value === null) standInObject[property] = value
    else if (Array.isArray(value)) {
      standInObject[property].length = 0
      value.forEach((item, index) => {
        standInObject[property][index] = item
      })
    }

    else {
      standInObject[property] = 'Object found in object ' + id + '.'
    }
  }
  objects[id] = standInObject
  return standInObject
},




character: standInCharacter,


refreshCharacter: (id) => {
  standInCharacter[id] = _players[id].character
},

refreshAllCharacters: () => {
  standInCharacter.length = 0
  _players.forEach(player => {
    standInCharacter.push(player.character)
  })
},




refreshMultiple: (...ids) => ids.forEach(id => players.refresh(id)),

refreshAll: () => _players.forEach((player, id) => players.refresh(id)),





refreshMultiple: () => (...ids) => ids.forEach(id => districts.refresh(id)),

refreshAll: () => _districts.forEach((district, id) => districts.refresh(id)),







// function getValue(operation, buffer, value, bufferName = 'valueBuffer', maxItems = 60) {
//   if (!_.getValue) _.getValue = {}
//   var __ = _.getValue
//   if (!__[bufferName]) __[bufferName] = []
//   if (!buffer) buffer = __[bufferName]
//   buffer.push(value)
//   if (buffer.length > maxItems) buffer.shift()
//   switch (operation) {
//     case 'max': return Math.max(...buffer)
//     case 'min': return Math.min(...buffer)
//     case 'average':
//       var total = buffer.reduce((total, value) => {
//         return total + value
//       }, 0)
//       return total / buffer.length
//   }
// }




socket.join(districtID.toString())

io.to(districtID.toString()).volatile.emit('objects', district)




function loopThroughDistricts(districts, callback, argument) {
  for (var districtID in districts) {
    var district = districts[districtID]
    callback(district, argument)
  }
}




function generateCollisionID(objectID, comparedObjectID) {
  var lower = Math.min(objectID, comparedObjectID)
  if (lower === objectID) var higher = comparedObjectID
  else higher = objectID
  return lower + '_' + higher
}





function generateKey() {
  var randomNumber = Math.random()
  var base36RandomNumber = randomNumber.toString(36)
  return base36RandomNumber.slice(2)
}




var a = _.districtBuffer[0]
var b = _.districtBuffer[1]
if (ratio === 1) preservePlayerCharacterLocation(b)
else {
  for (var objectType in _.district.objects) {
    if (objectType === 'aiCharacters' ||
      objectType === 'vehicles'
    ) {
      var objects = _.district[objectType]
      for (var objectID in objects) {
        var object = objects[objectID]
        var properties = ['x', 'y']
        properties.forEach(property => {
          var difference = b[objectType][objectID][property] - a[objectType][objectID][property]
          object[property] = a[objectType][objectID][property] + difference * ratio
        })
      }
    }
  }
}
}




function createElements(object, loop) {
  for (var property in object) {
    if (property === 'element') {
      var $element = document.createElement(object.element)
      $element.id = object.elementID
      document.body.appendChild($element)
      if (object !== _.camera) {
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
      createElements(nestedObject, 'loop')
    }
  }
}





function attemptAction(collisions) {
  var actions = {}
  for (var collisionID in collisions) {
    var collision = collisions[collisionID]
    var {character, vehicle} = collision
    if (character.action === 'enter_vehicle') {
      var match = character.keys.find(key => key === vehicle.key)
      if (match) {
        if (!actions[character.action]) actions[character.action] = {}
        actions[character.action][collisionID] = collision
      }
    }
  }
  return actions
}



function updateGrid(object) {
  if (object.action) {
    var {x, y, width, height, district, id} = object
    var grid = _.districts[district].grid
    var rowTop = getGridIndex(y)
    var sectionLeft = getGridIndex(x)
    if (!grid[rowTop]) grid[rowTop] = {}
    if (!grid[rowTop][sectionLeft]) grid[rowTop][sectionLeft] = {}
    grid[rowTop][sectionLeft][id] = object
    var xRight = x + width
    var sectionRight = getGridIndex(xRight)
    if (!grid[rowTop][sectionRight]) grid[rowTop][sectionRight] = {}
    grid[rowTop][sectionRight][id] = object
    var yBottom = y + height
    var rowBottom = getGridIndex(yBottom)
    if (!grid[rowBottom]) grid[rowBottom] = {}
    if (!grid[rowBottom][sectionLeft]) grid[rowBottom][sectionLeft] = {}
    grid[rowBottom][sectionLeft][id] = object
    if (!grid[rowBottom][sectionRight]) grid[rowBottom][sectionRight] = {}
    grid[rowBottom][sectionRight][id] = object
  }
}






function noGridCollisionDetection(comparedObject) {
  var collisions = {}
  for (var districtID in districts) {
    var district = districts[districtID]
    for (var objectType in district) {
      if (
        objectType === 'characters' ||
        objectType === 'aiCharacters' ||
        objectType === 'vehicles'
      ) {
        var objects = district[objectType]
        for (var objectID in objects) {
          var object = objects[objectID]
          var a = object
          var b = comparedObject
          if (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
          ) {
            var collisionID = getCollisionID(object.id, comparedObject.id)
            if (!collisions[collisionID]) {
              collisions[collisionID] = {}
              collisions[collisionID][object.id] = object
              collisions[collisionID][comparedObject.id] = comparedObject
            }
          }
        }
      }
    }
  }
  return collisions
}





function updateGrid(object) {
  var {x, y, width, height, district, id} = object
  var grid = districts[district].grid
  var rowTop = getGridIndex(y)
  var sectionLeft = getGridIndex(x)
  if (!grid[rowTop]) grid[rowTop] = {}
  if (!grid[rowTop][sectionLeft]) grid[rowTop][sectionLeft] = {}
  grid[rowTop][sectionLeft][id] = object
  var xRight = x + width
  var sectionRight = getGridIndex(xRight)
  if (!grid[rowTop][sectionRight]) grid[rowTop][sectionRight] = {}
  grid[rowTop][sectionRight][id] = object
  var yBottom = y + height
  var rowBottom = getGridIndex(yBottom)
  if (!grid[rowBottom]) grid[rowBottom] = {}
  if (!grid[rowBottom][sectionLeft]) grid[rowBottom][sectionLeft] = {}
  grid[rowBottom][sectionLeft][id] = object
  if (!grid[rowBottom][sectionRight]) grid[rowBottom][sectionRight] = {}
  grid[rowBottom][sectionRight][id] = object
  if (!grid[rowTop][sectionLeft].array) grid[rowTop][sectionLeft].array = []
  grid[rowTop][sectionLeft].array.push(grid[rowTop][sectionLeft][id])
  if (!grid[rowTop][sectionRight].array) grid[rowTop][sectionRight].array = []
  grid[rowTop][sectionRight].array.push(grid[rowTop][sectionRight][id])
  if (!grid[rowBottom][sectionLeft].array) grid[rowBottom][sectionLeft].array = []
  grid[rowBottom][sectionLeft].array.push(grid[rowBottom][sectionLeft][id])
  if (!grid[rowBottom][sectionRight].array) grid[rowBottom][sectionRight].array = []
  grid[rowBottom][sectionRight].array.push(grid[rowBottom][sectionRight][id])
}

function updateGrid(object) {
  var {x, y, width, height, district, id} = object
  var grid = districts[district].grid
  var rowTop = getGridIndex(y)
  var sectionLeft = getGridIndex(x)
  if (!grid[rowTop]) grid[rowTop] = {}
  if (!grid[rowTop][sectionLeft]) grid[rowTop][sectionLeft] = {}
  if (!grid[rowTop][sectionLeft].object) grid[rowTop][sectionLeft].object = {}
  grid[rowTop][sectionLeft].object[id] = object
  var xRight = x + width
  var sectionRight = getGridIndex(xRight)
  if (!grid[rowTop][sectionRight]) grid[rowTop][sectionRight] = {}
  if (!grid[rowTop][sectionRight].object) grid[rowTop][sectionRight].object = {}
  grid[rowTop][sectionRight].object[id] = object
  var yBottom = y + height
  var rowBottom = getGridIndex(yBottom)
  if (!grid[rowBottom]) grid[rowBottom] = {}
  if (!grid[rowBottom][sectionLeft]) grid[rowBottom][sectionLeft] = {}
  if (!grid[rowBottom][sectionLeft].object) grid[rowBottom][sectionLeft].object = {}
  grid[rowBottom][sectionLeft].object[id] = object
  if (!grid[rowBottom][sectionRight]) grid[rowBottom][sectionRight] = {}
  if (!grid[rowBottom][sectionRight].object) grid[rowBottom][sectionRight].object = {}
  grid[rowBottom][sectionRight].object[id] = object
  if (!grid[rowTop][sectionLeft].array) grid[rowTop][sectionLeft].array = []
  grid[rowTop][sectionLeft].array.push(grid[rowTop][sectionLeft].object[id])
  if (!grid[rowTop][sectionRight].array) grid[rowTop][sectionRight].array = []
  grid[rowTop][sectionRight].array.push(grid[rowTop][sectionRight].object[id])
  if (!grid[rowBottom][sectionLeft].array) grid[rowBottom][sectionLeft].array = []
  grid[rowBottom][sectionLeft].array.push(grid[rowBottom][sectionLeft].object[id])
  if (!grid[rowBottom][sectionRight].array) grid[rowBottom][sectionRight].array = []
  grid[rowBottom][sectionRight].array.push(grid[rowBottom][sectionRight].object[id])
}




var a = object
var b = comparedObject
var aLeft = a.x
var aRight = a.x + a.width
var bLeft = b.x
var bRight = b.x + b.width
var aTop = a.y
var aBottom = a.y + a.height
var bTop = b.y
var bBottom = b.y + b.height
if (
  aLeft < bRight &&
  aRight > bLeft &&
  aTop < bBottom &&
  aBottom > bTop
)



// var index = getReconcilliationIndex(playerID)
// updateReconcilliationBuffer(playerID, index, input)


checkForMissedEvents()


updatePlayerInputBuffer(playerID)


function checkForMissedEvents() {

}

// function reconcilePlayerCharactersSpeedDirection() {
//   reconcilliationBuffer.forEach(reconciliation => {
//     var {input, characterID, districtID} = reconciliation
//     var character = districts[districtID].characters[characterID]
//     if (input.right === true) {
//       character.direction = 'right'
//       character.speed = 5
//     }
//     else if (input.left === true) {
//       character.direction = 'left'
//       character.speed = 5
//     }
//     else character.speed = 0
//   })
// }














// client functions:

function checkNewImagesLoaded(object) {
  console.log('checking');
  if (client.imagesLoaded === client.imagesTotal) {
    // object.load = false
  }
  else {
    setTimeout(() => {
      checkNewImagesLoaded(object)
    }, 50)
  }
}

function checkForNewCharacters(character) {
  if (character.load) createElements(character)
  character.load = false
}



function countImages(object, loop) {
  for (var property in object) {
    if (property === 'element') {
      if (object.src) {
        client.imagesTotal += 1
        console.log('imagesTotal = ' + client.imagesTotal);
      }
    }
    else if (
      loop &&
      typeof object[property] !== 'string' &&
      typeof object[property] !== 'number' &&
      typeof object[property] !== 'boolean'
    ) {
      var nestedObject = object[property]
      countImages(nestedObject, true)
    }
  }
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
    client.inputBuffer = []
    client.upToDate = true
  }
}




function delay() {
  tick += ticksToProcess
  ticksToProcess = 1
  var onTime = true
  var maximumDelay = getMaximumDelay()
  var previousTime = time
  time = Date.now()
  var loopDuration = time - previousTime
  console.log('loopDuration = ' + loopDuration);
  loopDurations.push(loopDuration)
  if (loopDurations.length > 60) loopDurations.shift()
  loopDuration += delayRemainder
  while (loopDuration >= maximumDelay) {
    ticksToProcess += 1
    console.log('ticksToProcess = ' + ticksToProcess);
    loopDuration -= maximumDelay
    maximumDelay = getMaximumDelay()
    onTime = false
  }
  console.log('delayRemainder = ' + delayRemainder);
  if (onTime) {
    var averageLoopDuration = getAverageLoopDuration()
    console.log('averageLoopDuration = ' + averageLoopDuration);
    var delay = maximumDelay - averageLoopDuration
    setTimeout(refresh, delay)
  }
  else {
    delayRemainder = maximumDelay - loopDuration
    refresh()
  }
}






function getStandardDelay(averageLoopDuration) {
  const delays = [17, 17, 16]
  switch (server.delayIndex) {
    case 0:
      server.delayIndex = 1
      return delays[0]
    case 1:
      server.delayIndex = 2
      return delays[1]
    case 2:
      server.delayIndex = 0
      return delays[2]
    default:
      return null
  }
}





function updateDistrict() {
  if (client.tick > queuedDistrict.tick) {
    var ticksToReconcile = client.tick - queuedDistrict.tick
    var reverted = true
  }
  district = queuedDistrict
  queuedDistrict = null
  client.tick = district.tick
  if (reverted) reapplyInputsFromBuffer(ticksToReconcile)
  player.inputBuffer = []
}

function reapplyInputsFromBuffer(ticksToReconcile) {
}





function testing() {
  server.test.push(server.aheadBy)
  if (server.test.length > 1000) server.test.shift()
  var total = server.test.reduce((total, duration) => {
    return total + duration
  }, 0)
  var average = total / server.test.length
  return Math.round(average * 1000) / 1000
}







function setDelay() {
  var _ = client.delay
  var refreshDuration = performance.now() - _.refreshStartTime
  var totalDuration = performance.now() - _.totalStartTime
  _.totalStartTime = performance.now()
  var delayDuration = totalDuration - refreshDuration
  console.log('delayDuration = ' + delayDuration);
  if (_.checkForSlowdown) {
    console.log('is ' + delayDuration + ' > ' + _.delay + ' * 1.5?');
    if (delayDuration > _.delay * 1.5) {
      console.log('slowdownConfirmed!');
      _.slowdownCompensation = _.delay / delayDuration
      _.slowdownConfirmed = true
    }
  }
  _.millisecondsAhead += 16.666667 - totalDuration
  console.log('millisecondsAhead = ' + _.millisecondsAhead)
  console.log('averageMillisecondsAhead = ' +
    getAverage(_.millisecondsAhead, 'millisecondsAhead'));
  var averageRefreshDuration = getAverage(refreshDuration, 'refreshDuration')
  _.delay = 16.666667 + _.millisecondsAhead - averageRefreshDuration
  clearTimeout(_.timeoutID)
  if (_.delay < 5) {
    console.log('no delay');
    _.checkForSlowdown = false
    refresh()
  }
  else {
    console.log('prepping delay');
    if (_.slowdownConfirmed) {
      console.log('delay = ' + _.delay + ' * ' + _.slowdownCompensation);
      _.delay = _.delay * _.slowdownCompensation
      if (_.delay < 14) {
        if (_.delay < 7) {
          console.log('no delay, afterall');
          refresh()
        }
        else {
          _.checkForSlowdown = true
          _.slowdownConfirmed = false
          console.log('delaying ' + 0);
          _.timeoutID = setTimeout(refresh, 0)
        }
      }
      else {
        _.checkForSlowdown = true
        _.slowdownConfirmed = false
        console.log('delaying ' + _.delay);
        _.timeoutID = setTimeout(refresh, _.delay - 2)
      }
    }
    else {
      _.checkForSlowdown = true
      console.log('delaying ' + _.delay);
      _.timeoutID = setTimeout(refresh, _.delay - 2)
    }
  }
}






Old versions of server functions:


// function getPlayerIDBySocket(socket) {
//   for (var broadcastID in broadcasts) {
//     var broadcast = broadcasts[broadcastID]
//     for (var playerID in broadcast) {
//       var playerSocket = broadcast[playerID]
//       if (playerSocket === socket) {
//         return playerID
//       }
//     }
//   }
// }

// function removePlayerFromBroadcast(playerID) {
//   var districtID = players[playerID].district
//   var broadcast = broadcasts[districtID]
//   delete broadcast[playerID]
// }

// function broadcast() {
//   for (var districtID in broadcasts) {
//     var broadcast = broadcasts[districtID]
//     for (var playerID in broadcast) {
//       var socket = broadcast[playerID]
//       var district = districts[districtID]
//       district.tick = server.tick
//       var timestamp = now()
//       district.timestamp = timestamp
//       socket.volatile.emit('district', district)
//     }
//   }
// }

function broadcast() {
  for (var districtID in _.districts) {
    var district = _.districts[districtID]
    district.timestamp = now()
    district.tick = _.tick
    for (var playerID in _.players) {
      var player = _.players[playerID]
      var socket = player.socket
      socket.volatile.emit('district', _.districts[1])
    }
    // io.to(districtID.toString()).volatile.emit('district', district)
  }
}

function broadcast() {
  for (var districtID in _.districts) {
    var district = _.districts[districtID]
    district.timestamp = now()
    district.tick = _.tick
    io.to(districtID.toString()).volatile.emit('district', district)
  }
}

// function broadcastCharacterToDistrict(character, districtID) {
//   var broadcast = broadcasts[districtID]
//   for (var playerID in broadcast) {
//     var socket = broadcast[playerID]
//     socket.emit('character', character)
//   }
// }

// function associatePlayerWithSocket(playerID, socket, districtID) {
//   var broadcast = broadcasts[districtID]
//   broadcast[playerID] = socket
// }




unnecessary:

// socket.on('disconnect', socket => {
//   var playerID = getPlayerIDBySocket(socket)
//   removePlayerFromBroadcast(playerID)
// })





if (rerun) {
  var s = objectType.length - 1
  objectType = objectType.slice(0, s)
  objectID = player[objectType]
}







function updateLocation(objectType, rerun) {
  if (rerun && objectType !== ('characters' || 'player')) return
  var objects = district[objectType]
  for (var objectID in objects) {
    var object = objects[objectID]
    if (objectType === 'player') object = player
    if (rerun) {
      if (objectType !== 'player') {
        var s = objectType.length - 1
        objectType = objectType.slice(0, s)
      }
      object = _.rerun[objectType]
    }
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
    if (rerun || objectType === 'player') return
  }
}







function updatePlayerInputBuffer(playerID) {
  // var player = players[playerID]
  // var latencyBuffer = player.latencyBuffer
  // var total = latencyBuffer.reduce((total, value) => {
  //   return total + value
  // }, 0)
  // var latency = total / latencyBuffer.length
  // var ticksAgo = Math.floor(latency / (1000 / 60))
  // var index = 5 - ticksAgo
  // player.inputBuffer[index] = player.input
}

// function updateReconcilliationBuffer(playerID, index, input) {
//   var player = players[playerID]
//   var districtID = player.district
//   var characterID = player.character
// }

/* Use for persistent online world:
function getPlayerByToken(token) {
  for (var playerID in players) {
    var player = players[playerID]
    if (player.token === token) {
      return player
    }
  }
}
*/
