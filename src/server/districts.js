function Districts(_districts = []) {

  var neon = {
    timestamp: 0,
    tick: 0,
    id: undefined,
    type: 'neon',
    name: 'Neon District',
    status: '',
    width: 32000,
    height: 8000,
    grid: {},
    rooms: [],
    characters: [],
    vehicles: [],
    unwelcomes: [],
    scenery: {
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

  var standInNeon = {
    rooms: [],
    characters: [],
    vehicles: [],
    unwelcomes: []
  }

  function getGridIndex(coordinate) {
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

  var districts = {

    length: _districts.length,

    create: type => {

      var elementID = 0
      var layerY = 0

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

      switch (type) {
        case 'neon': var district = Object.assign({}, neon); break
        default: district = {}
      }

      assignElementIDsToScenery(district)
      composeScenery(district)
      var grid = createGrid()

      district.grid = grid
      district.id = _districts.length
      _districts.push(district)

      districts[district.id] = districts.get(district.id)
      districts.length = districts.getLength()

      return district.id
    },

    get: id => {
      var district = _districts[id]
      switch (district.type) {
        case 'neon': var standIn = standInNeon; break
        default: console.log('Cannot get district without type.')
      }
      for (var property in district) {
        var value = district[property]
        if (typeof value !== 'object' || value === null) standIn[property] = value
        else if (Array.isArray(value)) {
          standIn[property].length = 0
          value.forEach((item, index) => {
            standIn[property][index] = item
          })
        }
        else if (property === 'grid') standIn[property] = 'Use "districts.addToGrid()".'
        else if (property === 'scenery') standIn[property] = 'Scenery standIn not implemented.'
        else standIn[property] = 'Object found in district ' + id + '.'
      }
      return standIn
    },

    refresh: () => {
      var id = 0
      while (id < _districts.length) {
        districts[id] = districts.get(id)
        id++
      }
    },

    getLength: () => _districts.length,

    choose: () => {
      var district = _districts.find(district => district.characters.length < 500)
      return district.id
    },

    emit: (districtID, socket) => socket.emit('district', _districts[districtID]),

    populate: (objectID, objects) => {
      var object = objects[objectID]
      var {district, type} = object
      type = type + 's'
      _districts[district][type].push(objectID)
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
      var results = {}
      _districts.forEach(district => {
        var grid = district.grid
        for (var rowID in grid) {
          var row = grid[rowID]
          for (var sectionID in row) {
            var section = row[sectionID]
            var arrayA = section.a
            var arrayB = section.b
            arrayB.length = 0
            while (arrayA.length) {
              var objectID = arrayA.shift()
              var object = objects[objectID]
              arrayB.forEach(comparedObject => {
                var a = object
                var b = comparedObject
                if (
                  a.type === b.type &&
                  a.x < b.x + b.width &&
                  a.x + a.width > b.x &&
                  a.y < b.y + b.height &&
                  a.y + a.height > b.y
                ) {
                  if (a.type === 'vehicle') {
                    if (!results.collistions) results.collisions = []
                    results.collisions.push(a, b)
                  }
                  else {
                    if (!results.interactions) results.interactions = []
                    results.interactions.push(a, b)
                  }
                }
              })
              arrayB.push(object)
            }
          }
        }
      })
      return results
    }
  }

  return districts
}

module.exports = Districts
