function Districts(_districts = []) {

  const all = []

  const multiple = []

  const matches = {
    characters: [],
    vehicles: []
  }

  const detected = {
    collisions: {
      vehiclesA: [],
      vehiclesB: []
    },
    interactions: {
      charactersA: [],
      charactersB: []
    }
  }

  let elementID = 0
  let layerY = 0

  function createDistrict(type) {

    const districtPrototype = {
      id: undefined,
      established: undefined,
      type: 'neon',
      name: 'Neon District',
      status: '',
      width: 32000,
      height: 8000,
      grid: undefined,
      scenery: undefined,
      rooms: [],
      characters: [],
      vehicles: [],
      unwelcomes: []
    }

    const sceneries = {
      neon: {
        backgrounds: {
          '1': {
            id: 1,
            blueprints: [],
            element: 'canvas',
            width: 16000,
            height: 8000,
            depth: 4,
            sections: {
              '1': {
                id: 1,
                rows: 1,
                variations: {
                  '1': {
                    id: 1,
                    prevalence: 1,
                    element: 'img',
                    src: 'images/background/far/above-top.png',
                    width: 1024,
                    height: 367
                  }
                }
              },
              '2': {
                id: 2,
                rows: 1,
                variations: {
                  '1': {
                    id: 1,
                    prevalence: 4,
                    element: 'img',
                    src: 'images/background/far/top/top.png',
                    width: 1024,
                    height: 260
                  },
                  '2': {
                    id: 2,
                    prevalence: 1,
                    element: 'img',
                    src: 'images/background/far/top/top-pink-jumbotron-left.png',
                    width: 1024,
                    height: 260
                  },
                  '3': {
                    id: 3,
                    prevalence: 2,
                    element: 'img',
                    src: 'images/background/far/top/top-pink-jumbotron-right.png',
                    width: 1024,
                    height: 260
                  }
                }
              },
              '3': {
                id: 3,
                rows: 48,
                variations: {
                  '1': {
                    id: 1,
                    prevalence: 3,
                    element: 'img',
                    src: 'images/background/far/middle/middle.png',
                    width: 1024,
                    height: 134
                  },
                  '2': {
                    id: 2,
                    prevalence: 2,
                    element: 'img',
                    src: 'images/background/far/middle/middle-pink-jumbotron-far-left.png',
                    width: 1024,
                    height: 134
                  },
                  '3': {
                    id: 3,
                    prevalence: 1,
                    element: 'img',
                    src: 'images/background/far/middle/middle-pink-jumbotron-left.png',
                    width: 1024,
                    height: 134
                  },
                  '4': {
                    id: 4,
                    prevalence: 1,
                    element: 'img',
                    src: 'images/background/far/middle/middle-pink-jumbotron-mid-left.png',
                    width: 1024,
                    height: 134
                  },
                  '5': {
                    id: 5,
                    prevalence: 2,
                    element: 'img',
                    src: 'images/background/far/middle/middle-pink-jumbotron-middle.png',
                    width: 1024,
                    height: 134
                  },
                  '6': {
                    id: 6,
                    prevalence: 2,
                    element: 'img',
                    src: 'images/background/far/middle/middle-pink-jumbotron-right.png',
                    width: 1024,
                    height: 134
                  },
                  '7': {
                    id: 7,
                    prevalence: 3,
                    element: 'img',
                    src: 'images/background/far/middle/middle-blue-jumbotron-left.png',
                    width: 1024,
                    height: 134
                  },
                  '8': {
                    id: 8,
                    prevalence: 2,
                    element: 'img',
                    src: 'images/background/far/middle/middle-blue-jumbotron-middle.png',
                    width: 1024,
                    height: 134
                  },
                  '9': {
                    id: 9,
                    prevalence: 3,
                    element: 'img',
                    src: 'images/background/far/middle/middle-blue-jumbotron-right.png',
                    width: 1024,
                    height: 134
                  }
                }
              },
              '4': {
                id: 4,
                rows: 1,
                variations: {
                  '1': {
                    id: 1,
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
            id: 2,
            blueprints: [],
            y: 7050,
            element: 'canvas',
            width: 24000,
            height: 8000,
            depth: 2,
            sections: {
              '1': {
                id: 1,
                rows: 1,
                variations: {
                  '1': {
                    id: 1,
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
            id: 3,
            blueprints: [],
            y: 7232,
            element: 'canvas',
            width: 32000,
            height: 8000,
            depth: 1,
            sections: {
              '1': {
                id: 1,
                rows: 1,
                variations: {
                  '1': {
                    id: 1,
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
        foregrounds: {
          '1': {
            id: 1,
            blueprints: [],
            x: 0,
            y: 7456,
            width: 32000,
            height: 8000,
            depth: 0.5,
            element: 'canvas',
            scale: 16,
            sections: {
              '1': {
                id: 1,
                rows: 1,
                variations: {
                  '1': {
                    id: 1,
                    prevalence: 1,
                    element: 'img',
                    src: 'images/foreground/lamp/left.png',
                    width: 144,
                    height: 544
                  },
                  '2': {
                    id: 2,
                    prevalence: 1,
                    element: 'img',
                    src: 'images/foreground/lamp/right.png',
                    width: 144,
                    height: 544
                  }
                }
              }
            }
          },
          '2': {
            id: 2,
            blueprints: [],
            x: 32000,
            y: 7456,
            width: 32000,
            height: 8000,
            depth: 0.5,
            element: 'canvas',
            scale: 16,
            sections: {
              '1': {
                id: 1,
                rows: 1,
                variations: {
                  '1': {
                    id: 1,
                    prevalence: 1,
                    element: 'img',
                    src: 'images/foreground/lamp/left.png',
                    width: 144,
                    height: 544
                  },
                  '2': {
                    id: 2,
                    prevalence: 1,
                    element: 'img',
                    src: 'images/foreground/lamp/right.png',
                    width: 144,
                    height: 544
                  }
                }
              }
            }
          },
          '3': {
            id: 3,
            blueprints: [],
            x: 0,
            y: 6800,
            width: 32000,
            height: 8000,
            depth: 0.25,
            element: 'canvas',
            scale: 64,
            sections: {
              '1': {
                id: 1,
                rows: 1,
                variations: {
                  '1': {
                    id: 1,
                    prevalence: 1,
                    element: 'img',
                    src: 'images/foreground/arrow/up-left.png',
                    width: 448,
                    height: 1248
                  },
                  '2': {
                    id: 2,
                    prevalence: 1,
                    element: 'img',
                    src: 'images/foreground/arrow/up-right.png',
                    width: 448,
                    height: 1248
                  },
                  '3': {
                    id: 3,
                    prevalence: 1,
                    element: 'img',
                    src: 'images/foreground/arrow/down-left.png',
                    width: 448,
                    height: 1248
                  },
                  '4': {
                    id: 4,
                    prevalence: 1,
                    element: 'img',
                    src: 'images/foreground/arrow/down-right.png',
                    width: 448,
                    height: 1248
                  },
                  '5': {
                    id: 5,
                    prevalence: 1,
                    element: 'img',
                    src: 'images/foreground/arrow/left-up.png',
                    width: 1248,
                    height: 448
                  },
                  '6': {
                    id: 6,
                    prevalence: 1,
                    element: 'img',
                    src: 'images/foreground/arrow/left-down.png',
                    width: 1248,
                    height: 448
                  },
                  '7': {
                    id: 7,
                    prevalence: 1,
                    element: 'img',
                    src: 'images/foreground/arrow/right-up.png',
                    width: 1248,
                    height: 448
                  },
                  '8': {
                    id: 8,
                    prevalence: 1,
                    element: 'img',
                    src: 'images/foreground/arrow/right-down.png',
                    width: 1248,
                    height: 448
                  }
                }
              }
            }
          },
          '4': {
            id: 4,
            blueprints: [],
            x: 32000,
            y: 6800,
            width: 32000,
            height: 8000,
            depth: 0.25,
            element: 'canvas',
            scale: 64,
            sections: {
              '1': {
                id: 1,
                rows: 1,
                variations: {
                  '1': {
                    id: 1,
                    prevalence: 1,
                    element: 'img',
                    src: 'images/foreground/arrow/up-left.png',
                    width: 448,
                    height: 1248
                  },
                  '2': {
                    id: 2,
                    prevalence: 1,
                    element: 'img',
                    src: 'images/foreground/arrow/up-right.png',
                    width: 448,
                    height: 1248
                  },
                  '3': {
                    id: 3,
                    prevalence: 1,
                    element: 'img',
                    src: 'images/foreground/arrow/down-left.png',
                    width: 448,
                    height: 1248
                  },
                  '4': {
                    id: 4,
                    prevalence: 1,
                    element: 'img',
                    src: 'images/foreground/arrow/down-right.png',
                    width: 448,
                    height: 1248
                  },
                  '5': {
                    id: 5,
                    prevalence: 1,
                    element: 'img',
                    src: 'images/foreground/arrow/left-up.png',
                    width: 1248,
                    height: 448
                  },
                  '6': {
                    id: 6,
                    prevalence: 1,
                    element: 'img',
                    src: 'images/foreground/arrow/left-down.png',
                    width: 1248,
                    height: 448
                  },
                  '7': {
                    id: 7,
                    prevalence: 1,
                    element: 'img',
                    src: 'images/foreground/arrow/right-up.png',
                    width: 1248,
                    height: 448
                  },
                  '8': {
                    id: 8,
                    prevalence: 1,
                    element: 'img',
                    src: 'images/foreground/arrow/right-down.png',
                    width: 1248,
                    height: 448
                  }
                }
              }
            }
          },
          '5': {
            id: 5,
            blueprints: [],
            x: 64000,
            y: 6800,
            width: 32000,
            height: 8000,
            depth: 0.25,
            element: 'canvas',
            scale: 64,
            sections: {
              '1': {
                id: 1,
                rows: 1,
                variations: {
                  '1': {
                    id: 1,
                    prevalence: 1,
                    element: 'img',
                    src: 'images/foreground/arrow/up-left.png',
                    width: 448,
                    height: 1248
                  },
                  '2': {
                    id: 2,
                    prevalence: 1,
                    element: 'img',
                    src: 'images/foreground/arrow/up-right.png',
                    width: 448,
                    height: 1248
                  },
                  '3': {
                    id: 3,
                    prevalence: 1,
                    element: 'img',
                    src: 'images/foreground/arrow/down-left.png',
                    width: 448,
                    height: 1248
                  },
                  '4': {
                    id: 4,
                    prevalence: 1,
                    element: 'img',
                    src: 'images/foreground/arrow/down-right.png',
                    width: 448,
                    height: 1248
                  },
                  '5': {
                    id: 5,
                    prevalence: 1,
                    element: 'img',
                    src: 'images/foreground/arrow/left-up.png',
                    width: 1248,
                    height: 448
                  },
                  '6': {
                    id: 6,
                    prevalence: 1,
                    element: 'img',
                    src: 'images/foreground/arrow/left-down.png',
                    width: 1248,
                    height: 448
                  },
                  '7': {
                    id: 7,
                    prevalence: 1,
                    element: 'img',
                    src: 'images/foreground/arrow/right-up.png',
                    width: 1248,
                    height: 448
                  },
                  '8': {
                    id: 8,
                    prevalence: 1,
                    element: 'img',
                    src: 'images/foreground/arrow/right-down.png',
                    width: 1248,
                    height: 448
                  }
                }
              }
            }
          },
          '6': {
            id: 6,
            blueprints: [],
            x: 96000,
            y: 6800,
            width: 32000,
            height: 8000,
            depth: 0.25,
            element: 'canvas',
            scale: 64,
            sections: {
              '1': {
                id: 1,
                rows: 1,
                variations: {
                  '1': {
                    id: 1,
                    prevalence: 1,
                    element: 'img',
                    src: 'images/foreground/arrow/up-left.png',
                    width: 448,
                    height: 1248
                  },
                  '2': {
                    id: 2,
                    prevalence: 1,
                    element: 'img',
                    src: 'images/foreground/arrow/up-right.png',
                    width: 448,
                    height: 1248
                  },
                  '3': {
                    id: 3,
                    prevalence: 1,
                    element: 'img',
                    src: 'images/foreground/arrow/down-left.png',
                    width: 448,
                    height: 1248
                  },
                  '4': {
                    id: 4,
                    prevalence: 1,
                    element: 'img',
                    src: 'images/foreground/arrow/down-right.png',
                    width: 448,
                    height: 1248
                  },
                  '5': {
                    id: 5,
                    prevalence: 1,
                    element: 'img',
                    src: 'images/foreground/arrow/left-up.png',
                    width: 1248,
                    height: 448
                  },
                  '6': {
                    id: 6,
                    prevalence: 1,
                    element: 'img',
                    src: 'images/foreground/arrow/left-down.png',
                    width: 1248,
                    height: 448
                  },
                  '7': {
                    id: 7,
                    prevalence: 1,
                    element: 'img',
                    src: 'images/foreground/arrow/right-up.png',
                    width: 1248,
                    height: 448
                  },
                  '8': {
                    id: 8,
                    prevalence: 1,
                    element: 'img',
                    src: 'images/foreground/arrow/right-down.png',
                    width: 1248,
                    height: 448
                  }
                }
              }
            }
          }
        }
      }
    }

    var district = {...districtPrototype}

    for (var property in districtPrototype) {
      var value = districtPrototype[property]
      if (Array.isArray(value)) district[property] = [...value]
      else if (typeof value === 'object' && value !== null) {
        for (var nestedProperty in value) {
          var nestedValue = value[nestedProperty]
          district[property][nestedProperty] = {...nestedValue}
        }
      }
    }

    switch (type) {
      case 'neon': var scenery = sceneries.neon; break
      default:
    }

    if (type) district.scenery = scenery

    return district
  }

  function createGrid() {
    var grid = {}
    var row = -1
    while (row < 8) {
      var section = -1
      row += 1
      var rowID = getGridIndex(row * 1000)
      grid[rowID] = {}
      while (section < 32) {
        section += 1
        var sectionID = getGridIndex(section * 1000)
        grid[rowID][sectionID] = {}
        grid[rowID][sectionID].a = []
        grid[rowID][sectionID].b = []
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

  function assignElementIDsToScenery(object) {
    for (var property in object) {
      if (property === 'element') {
        var id = elementID += 1
        object.elementID = 's' + id
      }
      else if (
        typeof object[property] !== 'string' &&
        typeof object[property] !== 'number' &&
        typeof object[property] !== 'boolean'
      ) {
        var nestedObject = object[property]
        assignElementIDsToScenery(nestedObject)
      }
    }
  }

  function composeScenery(district) {
    for (var type in district.scenery) {
      var layers = district.scenery[type]
      layerY = 0
      for (var layerID in layers) {
        var layer = layers[layerID]
        for (var sectionID in layer.sections) {
          var section = layer.sections[sectionID]
          var rows = section.rows
          var variationsArray = []
          for (var variationID in section.variations) {
            var variation = section.variations[variationID]
            for (var i = 0; i < variation.prevalence; i++) {
              variationsArray.push(variation)
            }
          }
          createBlueprints(type, layer, section, rows, variationsArray)
        }
      }
    }
  }

  function createBlueprints(type, layer, section, rows, variationsArray) {
    var rowsDrawn = 0
    function startRow() {
      var x = 0
      var rowY = 0
      function createBlueprint() {
        if (x < layer.width) {
          var index = Math.floor(Math.random() * variationsArray.length)
          var variation = variationsArray[index]
          if (layer.y) layerY = layer.y
          var blueprint = {section: section.id, variation: variation.id, x, y: layerY}
          layer.blueprints.push(blueprint)
          if (type === 'foregrounds') {
            if (layer.id < 3) {
              x += 2000
            }
            else {
              var gap = Math.floor(Math.random() * (3000 - 1000) + 1000)
              x += gap + variation.width
            }
          }
          x += variation.width
          rowY = variation.height
          createBlueprint()
        }
        else {
          rowsDrawn += 1
          layerY += rowY
          startRow()
        }
      }
      if (rowsDrawn < rows) createBlueprint()
    }
    startRow()
  }

  var districts = {

    length: _districts.length,

    create: type => {

      var district = createDistrict(type)
      var districtClone = createDistrict(type)

      if (type) {
        assignElementIDsToScenery(district)
        composeScenery(district)
        var grid = createGrid()
        district.grid = grid
      }

      district.established = Date.now()

      district.id = _districts.length
      _districts.push(district)

      const id = district.id
      districts[id] = districtClone
      districts.clone(id)
      districts.refreshLength()

      return id
    },

    clone: id => {
      const districtClone = districts[id]
      const district = _districts[id]

      Object.assign = (districtClone, district)
      for (var property in district) {
        var value = district[property]
        if (Array.isArray(value)) {
          districtClone[property].length = 0
          districtClone[property] = [...value]
        }
        else if (typeof value === 'object' && value !== null) {
          for (var nestedProperty in value) {
            var nestedValue = value[nestedProperty]
            district[property][nestedProperty] = {...nestedValue}
          }
        }
      }

      districts[id] = districtClone
      return districtClone
    },

    cloneMultiple: (...ids) => {
      multiple.length = 0
      ids.forEach(id => {
        var district = districts.clone(id)
        multiple.push(district)
      })
      return multiple
    },

    cloneAll: () => {
      all.length = 0
      _districts.forEach((item, id) => {
        var district = districts.clone(id)
        all.push(district)
      })
    },

    cloneLength: () => {
      districts.length = _districts.length
    },

    choose: () => {
      var district = _districts.find(district => (district.characters.length < 500 && district.id))
      return district.id
    },

    emit: (districtID, socket) => socket.emit('district', _districts[districtID]),

    addToDistrict: (...objects) => {
      objects.forEach(object => {
        var {district, type, id} = object
        type = type + 's'
        _districts[district][type].push(id)
        districts[district][type].push(id)
      })
    },

    checkVehicleKeyMatches: (walkers) => {
      console.log('checkVehicleKeyMatches');
      var {characters, vehicles} = matches
      characters.length = 0
      vehicles.length = 0
      walkers.forEach(character => {
        var {district, vehicleKeys, id} = character
        var vehiclesInDistrict = _districts[district].vehicles
        vehicleKeys.forEach(key => {
          var vehicleID = vehiclesInDistrict.find(vehicle => vehicle === key)
          if (vehicleID) {
            characters.push(id)
            vehicles.push(vehicleID)
          }
        })
      })
      return matches
    },

    addToGrid: (objectIDs, objects) => {
      objectIDs.forEach(objectID => {
        var object = objects[objectID]
        var {x, y, width, height, district} = object
        var grid = _districts[district].grid
        var xRight = x + width
        var yBottom = y + height
        var rowTop = getGridIndex(y)
        var rowBottom = getGridIndex(yBottom)
        var sectionLeft = getGridIndex(x)
        var sectionRight = getGridIndex(xRight)
        grid[rowTop][sectionLeft].a.push(objectID)
        if (sectionLeft !== sectionRight) {
          grid[rowTop][sectionRight].a.push(objectID)
        }
        if (rowTop !== rowBottom) {
          grid[rowBottom][sectionLeft][objectID].a.push(objectID)
          if (sectionLeft !== sectionRight) {
            grid[rowBottom][sectionRight][objectID].a.push(objectID)
          }
        }
      })
    },

    detectCollisions: objects => {
      var {collisions: {vehiclesA, vehiclesB}, interactions: {charactersA, charactersB}} = detected
      vehiclesA.length = 0
      vehiclesB.length = 0
      charactersA.length = 0
      charactersB.length = 0

      _districts.forEach(district => {
        var grid = district.grid
        for (var rowID in grid) {
          var row = grid[rowID]
          for (var sectionID in row) {
            var section = row[sectionID]
            var objectsToCompare = section.a
            var comparedObjects = section.b

            comparedObjects.length = 0
            while (objectsToCompare.length) {
              var objectToCompareID = objectsToCompare.shift()
              var objectToCompare = objects[objectToCompareID]
              var {x, y, width, height, type} = objectToCompare

              comparedObjects.forEach(comparedObjectID => {
                var comparedObject = objects[comparedObjectID]
                var {x: X, y: Y, width: WIDTH, height: HEIGHT, type: TYPE} = comparedObject

                if (
                  type === TYPE &&
                  x < X + WIDTH &&
                  x + width > X &&
                  y < Y + HEIGHT &&
                  y + height > Y
                ) {

                  if (type === 'vehicle') {
                    vehiclesA.push(objectToCompare)
                    vehiclesB.push(comparedObject)
                  }
                  else {
                    charactersA.push(objectToCompare)
                    charactersB.push(comparedObjectID)
                  }
                }
              })
              comparedObjects.push(objectToCompare)
            }
          }
        }
      })
      return detected
    }
  }

  return districts
}

module.exports = Districts
