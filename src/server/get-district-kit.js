export const getDistrictKit = function (_districts = []) {

  const all = []

  const multiple = []

  const matches = {
    characters: [],
    vehicles: [],
    checkedWalkers: [],
    matchesForCharacter: []
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

  let elementId = 0
  let layerY = 0

  const createDistrict = () => {
    const scenery = {
      backgrounds: {
        1: {
          id: 1,
          blueprints: [],
          tag: 'canvas',
          width: 16000,
          height: 8000,
          depth: 4,
          sections: {
            1: {
              id: 1,
              rows: 1,
              variations: {
                1: {
                  id: 1,
                  prevalence: 1,
                  tag: 'img',
                  src: 'images/background/far/above-top.png',
                  width: 1024,
                  height: 367
                }
              }
            },
            2: {
              id: 2,
              rows: 1,
              variations: {
                1: {
                  id: 1,
                  prevalence: 4,
                  tag: 'img',
                  src: 'images/background/far/top/top.png',
                  width: 1024,
                  height: 260
                },
                2: {
                  id: 2,
                  prevalence: 1,
                  tag: 'img',
                  src: 'images/background/far/top/top-pink-jumbotron-left.png',
                  width: 1024,
                  height: 260
                },
                3: {
                  id: 3,
                  prevalence: 2,
                  tag: 'img',
                  src: 'images/background/far/top/top-pink-jumbotron-right.png',
                  width: 1024,
                  height: 260
                }
              }
            },
            3: {
              id: 3,
              rows: 48,
              variations: {
                1: {
                  id: 1,
                  prevalence: 3,
                  tag: 'img',
                  src: 'images/background/far/middle/middle.png',
                  width: 1024,
                  height: 134
                },
                2: {
                  id: 2,
                  prevalence: 2,
                  tag: 'img',
                  src: 'images/background/far/middle/middle-pink-jumbotron-far-left.png',
                  width: 1024,
                  height: 134
                },
                3: {
                  id: 3,
                  prevalence: 1,
                  tag: 'img',
                  src: 'images/background/far/middle/middle-pink-jumbotron-left.png',
                  width: 1024,
                  height: 134
                },
                4: {
                  id: 4,
                  prevalence: 1,
                  tag: 'img',
                  src: 'images/background/far/middle/middle-pink-jumbotron-mid-left.png',
                  width: 1024,
                  height: 134
                },
                5: {
                  id: 5,
                  prevalence: 2,
                  tag: 'img',
                  src: 'images/background/far/middle/middle-pink-jumbotron-middle.png',
                  width: 1024,
                  height: 134
                },
                6: {
                  id: 6,
                  prevalence: 2,
                  tag: 'img',
                  src: 'images/background/far/middle/middle-pink-jumbotron-right.png',
                  width: 1024,
                  height: 134
                },
                7: {
                  id: 7,
                  prevalence: 3,
                  tag: 'img',
                  src: 'images/background/far/middle/middle-blue-jumbotron-left.png',
                  width: 1024,
                  height: 134
                },
                8: {
                  id: 8,
                  prevalence: 2,
                  tag: 'img',
                  src: 'images/background/far/middle/middle-blue-jumbotron-middle.png',
                  width: 1024,
                  height: 134
                },
                9: {
                  id: 9,
                  prevalence: 3,
                  tag: 'img',
                  src: 'images/background/far/middle/middle-blue-jumbotron-right.png',
                  width: 1024,
                  height: 134
                }
              }
            },
            4: {
              id: 4,
              rows: 1,
              variations: {
                1: {
                  id: 1,
                  prevalence: 1,
                  tag: 'img',
                  src: 'images/background/far/bottom.png',
                  width: 1024,
                  height: 673
                }
              }
            }
          }
        },
        2: {
          id: 2,
          blueprints: [],
          y: 7050,
          tag: 'canvas',
          width: 24000,
          height: 8000,
          depth: 2,
          sections: {
            1: {
              id: 1,
              rows: 1,
              variations: {
                1: {
                  id: 1,
                  width: 1024,
                  height: 768,
                  prevalence: 1,
                  tag: 'img',
                  src: 'images/background/middle.png'
                }
              }
            }
          }
        },
        3: {
          id: 3,
          blueprints: [],
          y: 7232,
          tag: 'canvas',
          width: 32000,
          height: 8000,
          depth: 1,
          sections: {
            1: {
              id: 1,
              rows: 1,
              variations: {
                1: {
                  id: 1,
                  width: 1408,
                  height: 768,
                  prevalence: 1,
                  tag: 'img',
                  src: 'images/background/near.png'
                }
              }
            }
          }
        }
      },
      foregrounds: {
        1: {
          id: 1,
          blueprints: [],
          x: 0,
          y: 7456,
          width: 32000,
          height: 8000,
          depth: 0.5,
          tag: 'canvas',
          scale: 16,
          sections: {
            1: {
              id: 1,
              rows: 1,
              variations: {
                1: {
                  id: 1,
                  prevalence: 1,
                  tag: 'img',
                  src: 'images/foreground/lamp/left.png',
                  width: 144,
                  height: 544
                },
                2: {
                  id: 2,
                  prevalence: 1,
                  tag: 'img',
                  src: 'images/foreground/lamp/right.png',
                  width: 144,
                  height: 544
                }
              }
            }
          }
        },
        2: {
          id: 2,
          blueprints: [],
          x: 32000,
          y: 7456,
          width: 32000,
          height: 8000,
          depth: 0.5,
          tag: 'canvas',
          scale: 16,
          sections: {
            1: {
              id: 1,
              rows: 1,
              variations: {
                1: {
                  id: 1,
                  prevalence: 1,
                  tag: 'img',
                  src: 'images/foreground/lamp/left.png',
                  width: 144,
                  height: 544
                },
                2: {
                  id: 2,
                  prevalence: 1,
                  tag: 'img',
                  src: 'images/foreground/lamp/right.png',
                  width: 144,
                  height: 544
                }
              }
            }
          }
        },
        3: {
          id: 3,
          blueprints: [],
          x: 0,
          y: 6800,
          width: 32000,
          height: 8000,
          depth: 0.25,
          tag: 'canvas',
          scale: 64,
          sections: {
            1: {
              id: 1,
              rows: 1,
              variations: {
                1: {
                  id: 1,
                  prevalence: 1,
                  tag: 'img',
                  src: 'images/foreground/arrow/up-left.png',
                  width: 448,
                  height: 1248
                },
                2: {
                  id: 2,
                  prevalence: 1,
                  tag: 'img',
                  src: 'images/foreground/arrow/up-right.png',
                  width: 448,
                  height: 1248
                },
                3: {
                  id: 3,
                  prevalence: 1,
                  tag: 'img',
                  src: 'images/foreground/arrow/down-left.png',
                  width: 448,
                  height: 1248
                },
                4: {
                  id: 4,
                  prevalence: 1,
                  tag: 'img',
                  src: 'images/foreground/arrow/down-right.png',
                  width: 448,
                  height: 1248
                },
                5: {
                  id: 5,
                  prevalence: 1,
                  tag: 'img',
                  src: 'images/foreground/arrow/left-up.png',
                  width: 1248,
                  height: 448
                },
                6: {
                  id: 6,
                  prevalence: 1,
                  tag: 'img',
                  src: 'images/foreground/arrow/left-down.png',
                  width: 1248,
                  height: 448
                },
                7: {
                  id: 7,
                  prevalence: 1,
                  tag: 'img',
                  src: 'images/foreground/arrow/right-up.png',
                  width: 1248,
                  height: 448
                },
                8: {
                  id: 8,
                  prevalence: 1,
                  tag: 'img',
                  src: 'images/foreground/arrow/right-down.png',
                  width: 1248,
                  height: 448
                }
              }
            }
          }
        },
        4: {
          id: 4,
          blueprints: [],
          x: 32000,
          y: 6800,
          width: 32000,
          height: 8000,
          depth: 0.25,
          tag: 'canvas',
          scale: 64,
          sections: {
            1: {
              id: 1,
              rows: 1,
              variations: {
                1: {
                  id: 1,
                  prevalence: 1,
                  tag: 'img',
                  src: 'images/foreground/arrow/up-left.png',
                  width: 448,
                  height: 1248
                },
                2: {
                  id: 2,
                  prevalence: 1,
                  tag: 'img',
                  src: 'images/foreground/arrow/up-right.png',
                  width: 448,
                  height: 1248
                },
                3: {
                  id: 3,
                  prevalence: 1,
                  tag: 'img',
                  src: 'images/foreground/arrow/down-left.png',
                  width: 448,
                  height: 1248
                },
                4: {
                  id: 4,
                  prevalence: 1,
                  tag: 'img',
                  src: 'images/foreground/arrow/down-right.png',
                  width: 448,
                  height: 1248
                },
                5: {
                  id: 5,
                  prevalence: 1,
                  tag: 'img',
                  src: 'images/foreground/arrow/left-up.png',
                  width: 1248,
                  height: 448
                },
                6: {
                  id: 6,
                  prevalence: 1,
                  tag: 'img',
                  src: 'images/foreground/arrow/left-down.png',
                  width: 1248,
                  height: 448
                },
                7: {
                  id: 7,
                  prevalence: 1,
                  tag: 'img',
                  src: 'images/foreground/arrow/right-up.png',
                  width: 1248,
                  height: 448
                },
                8: {
                  id: 8,
                  prevalence: 1,
                  tag: 'img',
                  src: 'images/foreground/arrow/right-down.png',
                  width: 1248,
                  height: 448
                }
              }
            }
          }
        },
        5: {
          id: 5,
          blueprints: [],
          x: 64000,
          y: 6800,
          width: 32000,
          height: 8000,
          depth: 0.25,
          tag: 'canvas',
          scale: 64,
          sections: {
            1: {
              id: 1,
              rows: 1,
              variations: {
                1: {
                  id: 1,
                  prevalence: 1,
                  tag: 'img',
                  src: 'images/foreground/arrow/up-left.png',
                  width: 448,
                  height: 1248
                },
                2: {
                  id: 2,
                  prevalence: 1,
                  tag: 'img',
                  src: 'images/foreground/arrow/up-right.png',
                  width: 448,
                  height: 1248
                },
                3: {
                  id: 3,
                  prevalence: 1,
                  tag: 'img',
                  src: 'images/foreground/arrow/down-left.png',
                  width: 448,
                  height: 1248
                },
                4: {
                  id: 4,
                  prevalence: 1,
                  tag: 'img',
                  src: 'images/foreground/arrow/down-right.png',
                  width: 448,
                  height: 1248
                },
                5: {
                  id: 5,
                  prevalence: 1,
                  tag: 'img',
                  src: 'images/foreground/arrow/left-up.png',
                  width: 1248,
                  height: 448
                },
                6: {
                  id: 6,
                  prevalence: 1,
                  tag: 'img',
                  src: 'images/foreground/arrow/left-down.png',
                  width: 1248,
                  height: 448
                },
                7: {
                  id: 7,
                  prevalence: 1,
                  tag: 'img',
                  src: 'images/foreground/arrow/right-up.png',
                  width: 1248,
                  height: 448
                },
                8: {
                  id: 8,
                  prevalence: 1,
                  tag: 'img',
                  src: 'images/foreground/arrow/right-down.png',
                  width: 1248,
                  height: 448
                }
              }
            }
          }
        },
        6: {
          id: 6,
          blueprints: [],
          x: 96000,
          y: 6800,
          width: 32000,
          height: 8000,
          depth: 0.25,
          tag: 'canvas',
          scale: 64,
          sections: {
            1: {
              id: 1,
              rows: 1,
              variations: {
                1: {
                  id: 1,
                  prevalence: 1,
                  tag: 'img',
                  src: 'images/foreground/arrow/up-left.png',
                  width: 448,
                  height: 1248
                },
                2: {
                  id: 2,
                  prevalence: 1,
                  tag: 'img',
                  src: 'images/foreground/arrow/up-right.png',
                  width: 448,
                  height: 1248
                },
                3: {
                  id: 3,
                  prevalence: 1,
                  tag: 'img',
                  src: 'images/foreground/arrow/down-left.png',
                  width: 448,
                  height: 1248
                },
                4: {
                  id: 4,
                  prevalence: 1,
                  tag: 'img',
                  src: 'images/foreground/arrow/down-right.png',
                  width: 448,
                  height: 1248
                },
                5: {
                  id: 5,
                  prevalence: 1,
                  tag: 'img',
                  src: 'images/foreground/arrow/left-up.png',
                  width: 1248,
                  height: 448
                },
                6: {
                  id: 6,
                  prevalence: 1,
                  tag: 'img',
                  src: 'images/foreground/arrow/left-down.png',
                  width: 1248,
                  height: 448
                },
                7: {
                  id: 7,
                  prevalence: 1,
                  tag: 'img',
                  src: 'images/foreground/arrow/right-up.png',
                  width: 1248,
                  height: 448
                },
                8: {
                  id: 8,
                  prevalence: 1,
                  tag: 'img',
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
    const defaultDistrict = {
      id: null,
      establishedAt: null,
      type: 'neon',
      name: 'Neon District',
      status: '',
      width: 32000,
      height: 8000,
      grid: null,
      rooms: [],
      characters: [],
      vehicles: [],
      unwelcomes: [],
      scenery
    }
    return Object
      .entries(defaultDistrict)
      .reduce(appendAttribute, {})
  }

  const appendAttribute = (district, [key, value]) => {
    district[key] =
      Array.isArray(value) ? [...value]
      : value && value === 'object' ? {...value}
      : value
    return district
  }

  const createGrid = () => {
    const grid = {}
    let rowCount = 8
    while (rowCount) {
      --rowCount
      const rowId = getGridIndex(rowCount * 1000)
      const row = grid[rowId] = {}
      let sectionCount = 32
      while (sectionCount) {
        --sectionCount
        const sectionId = getGridIndex(sectionCount * 1000)
        const section = row[sectionId] = {}
        section.a = []
        section.b = []
      }
    }
    return grid
  }

  const getGridIndex = coordinate => {
    coordinate = Math.round(coordinate)
    coordinate = coordinate.toString()
    const {length} = coordinate
    let zerosToAdd = 5 - length
    let zeros = ''
    while (zerosToAdd > 0) {
      zeros += '0'
      --zerosToAdd
    }
    coordinate = zeros + coordinate
    return coordinate.slice(0, 2)
  }

  const assignElementId = scenery => Object
    .entries(scenery)
    .forEach(([key, value]) => {
      if (key === 'tag') scenery.elementId = 's' + ++elementId
      else if (value && typeof value === 'object') assignElementId(value)
    })

  const composeScenery = scenery => Object.entries(scenery).forEach(pair => {
    const [type, layers] = pair
    const handleLayerWithThis = handleLayer.bind({type})
    layerY = 0
    Object.values(layers).forEach(handleLayerWithThis)
  })

  const handleLayer = function (layer) {
    const {type} = this
    const {sections} = layer
    const handleSectionWithThis = handleSection.bind({type, layer})
    Object.values(sections).forEach(handleSectionWithThis)
  }

  const handleSection = function (section) {
    const {type, layer} = this
    const {rows, variations} = section
    const variationOptions = []
    const pushVariationWithThis = pushVariation.bind({variationOptions})
    Object.values(variations).forEach(pushVariationWithThis)
    createBlueprints({type, layer, section, rows, variationOptions})
  }

  const pushVariation = function (variation) {
    const {variationOptions} = this
    let {prevalence} = variation
    while (prevalence) variationOptions.push(variation) && --prevalence
  }

  function createBlueprints({type, layer, section, rows, variationOptions}) {
    var rowsDrawn = 0
    function startRow() {
      var x = 0
      var rowY = 0
      function createBlueprint() {
        if (x < layer.width) {
          var index = Math.floor(Math.random() * variationOptions.length)
          var variation = variationOptions[index]
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

  var districtKit = {

    length: _districts.length,

    create: isMayor => {
      const district = createDistrict()
      const districtClone = createDistrict()
      const {scenery} = district
      if (!isMayor) {
        assignElementId(scenery)
        composeScenery(scenery)
        district.grid = createGrid()
      }
      district.establishedAt = Date.now()
      district.id = _districts.length
      _districts.push(district)
      const {id} = district
      districtKit[id] = districtClone
      districtKit.clone(id)
      districtKit.refreshLength()
      return id
    },

    clone: id => {
      const districtClone = districtKit[id]
      const district = _districts[id]
      for (var property in district) {
        var value = district[property]
        if (typeof value !== 'object' || value === null) {
          districtClone[property] = value
        }
        else if (Array.isArray(value)) {
          districtClone[property].length = 0
          value.forEach(item => districtClone[property].push(item))
        }
        else if (typeof value === 'object' && value !== null) {
          for (var nestedProperty in value) {
            var nestedValue = value[nestedProperty]
            if (typeof nestedValue !== 'object' || nestedValue === null) {
              districtClone[property][nestedProperty] = nestedValue
            }
          }
        }
      }
      districtKit[id] = districtClone
      return districtClone
    },

    cloneMultiple: (...idArrays) => {
      multiple.length = 0
      if (idArrays.length) {
        idArrays.forEach(idArray => {
          if (idArray) {
            idArray.forEach(id => {
              if (id) {
                var districtClone = districtKit.clone(id)
                multiple.push(districtClone)
              }
            })
          }
        })
      }
      return multiple
    },

    cloneAll: () => {
      all.length = 0
      _districts.forEach((unusedItem, id) => {
        var district = districtKit.clone(id)
        all.push(district)
      })
      return all
    },

    refreshLength: () => {
      districtKit.length = _districts.length
    },

    choose: () => {
      var district = _districts.find(district => (district.characters.length < 500 && district.id))
      if (district) return district.id
      else return undefined
    },

    emit: (districtId, socket) => socket.emit('district', _districts[districtId]),

    addToDistrict: (...things) => {
      things.forEach(cityElement => {
        var {district, type, id} = cityElement
        type = type + 's'
        _districts[district][type].push(id)
        districtKit[district][type].push(id)
      })
    },

    checkVehicleKeyMatches: (walkers) => {
      var {characters, vehicles, matchesForCharacter, checkedWalkers} = matches
      characters.length = 0
      vehicles.length = 0
      checkedWalkers.length = 0
      matchesForCharacter.length = 0

      walkers.forEach(character => {
        matchesForCharacter.length = 0
        var {district, vehicleKeys, id} = character
        var vehiclesInCharacterDistrict = _districts[district].vehicles
        vehicleKeys.forEach(key => {
          var vehicleId = vehiclesInCharacterDistrict.find(vehicle => vehicle === key)
          if (vehicleId) {
            characters.push(id)
            vehicles.push(vehicleId)
            matchesForCharacter.push(id)
          }
        })
        if (!matchesForCharacter.length) checkedWalkers.push(id)
      })
      return matches
    },

    addToGrid: (entities) => {
      entities.forEach(cityElement => {
        var {x, y, width, height, district, id} = cityElement
        var grid = _districts[district].grid
        var xRight = x + width
        var yBottom = y + height
        var rowTop = getGridIndex(y)
        var rowBottom = getGridIndex(yBottom)
        var sectionLeft = getGridIndex(x)
        var sectionRight = getGridIndex(xRight)
        grid[rowTop][sectionLeft].a.push(id)
        if (sectionLeft !== sectionRight) {
          grid[rowTop][sectionRight].a.push(id)
        }
        if (rowTop !== rowBottom) {
          grid[rowBottom][sectionLeft].a.push(id)
          if (sectionLeft !== sectionRight) {
            grid[rowBottom][sectionRight].a.push(id)
          }
        }
      })
    },

    detectCollisions: entities => {
      var {collisions, interactions} = detected
      const {vehiclesA, vehiclesB} = collisions
      const {charactersA, charactersB} = interactions
      vehiclesA.length = 0
      vehiclesB.length = 0
      charactersA.length = 0
      charactersB.length = 0

      _districts.forEach(district => {
        var grid = district.grid
        for (var rowId in grid) {
          var row = grid[rowId]
          for (var sectionId in row) {
            var section = row[sectionId]
            var cityElementsToCompare = section.a
            var comparedCityElements = section.b

            comparedCityElements.length = 0
            while (cityElementsToCompare.length) {
              var cityElementToCompareId = cityElementsToCompare.shift()
              var cityElementToCompare = entities[cityElementToCompareId]
              if (cityElementToCompare) var {x, y, width, height, type} = cityElementToCompare

              comparedCityElements.forEach(comparedCityElementId => {
                var comparedCityElement = entities[comparedCityElementId]
                var {x: x_, y: y_, width: width_, height: height_, type: type_} = comparedCityElement

                if (
                  type === type_ &&
                  x < x_ + width_ &&
                  x + width > x_ &&
                  y < y_ + height_ &&
                  y + height > y_
                ) {

                  if (type === 'vehicle') {
                    vehiclesA.push(cityElementToCompare)
                    vehiclesB.push(comparedCityElement)
                  }
                  else {
                    charactersA.push(cityElementToCompare)
                    charactersB.push(comparedCityElement)
                  }
                }
              })
              comparedCityElements.push(cityElementToCompare)
            }
          }
        }
      })
      return detected
    }
  }

  return districtKit
}
