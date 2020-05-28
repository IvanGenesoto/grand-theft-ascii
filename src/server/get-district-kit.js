export const getDistrictKit = function () {

  const createDistrict = () => {
    const backgroundLayers = [
      {
        id: 1,
        blueprints: [],
        tag: 'canvas',
        width: 16000,
        height: 8000,
        depth: 4,
        sections: [
          {
            id: 1,
            rowCount: 1,
            variations: [
              {
                id: 1,
                prevalence: 1,
                tag: 'img',
                src: 'images/background/far/above-top.png',
                width: 1024,
                height: 367
              }
            ]
          },
          {
            id: 2,
            rowCount: 1,
            variations: [
              {
                id: 1,
                prevalence: 4,
                tag: 'img',
                src: 'images/background/far/top/top.png',
                width: 1024,
                height: 260
              },
              {
                id: 2,
                prevalence: 1,
                tag: 'img',
                src: 'images/background/far/top/top-pink-jumbotron-left.png',
                width: 1024,
                height: 260
              },
              {
                id: 3,
                prevalence: 2,
                tag: 'img',
                src: 'images/background/far/top/top-pink-jumbotron-right.png',
                width: 1024,
                height: 260
              }
            ]
          },
          {
            id: 3,
            rowCount: 48,
            variations: [
              {
                id: 1,
                prevalence: 3,
                tag: 'img',
                src: 'images/background/far/middle/middle.png',
                width: 1024,
                height: 134
              },
              {
                id: 2,
                prevalence: 2,
                tag: 'img',
                src: 'images/background/far/middle/middle-pink-jumbotron-far-left.png',
                width: 1024,
                height: 134
              },
              {
                id: 3,
                prevalence: 1,
                tag: 'img',
                src: 'images/background/far/middle/middle-pink-jumbotron-left.png',
                width: 1024,
                height: 134
              },
              {
                id: 4,
                prevalence: 1,
                tag: 'img',
                src: 'images/background/far/middle/middle-pink-jumbotron-mid-left.png',
                width: 1024,
                height: 134
              },
              {
                id: 5,
                prevalence: 2,
                tag: 'img',
                src: 'images/background/far/middle/middle-pink-jumbotron-middle.png',
                width: 1024,
                height: 134
              },
              {
                id: 6,
                prevalence: 2,
                tag: 'img',
                src: 'images/background/far/middle/middle-pink-jumbotron-right.png',
                width: 1024,
                height: 134
              },
              {
                id: 7,
                prevalence: 3,
                tag: 'img',
                src: 'images/background/far/middle/middle-blue-jumbotron-left.png',
                width: 1024,
                height: 134
              },
              {
                id: 8,
                prevalence: 2,
                tag: 'img',
                src: 'images/background/far/middle/middle-blue-jumbotron-middle.png',
                width: 1024,
                height: 134
              },
              {
                id: 9,
                prevalence: 3,
                tag: 'img',
                src: 'images/background/far/middle/middle-blue-jumbotron-right.png',
                width: 1024,
                height: 134
              }
            ]
          },
          {
            id: 4,
            rowCount: 1,
            variations: [
              {
                id: 1,
                prevalence: 1,
                tag: 'img',
                src: 'images/background/far/bottom.png',
                width: 1024,
                height: 673
              }
            ]
          }
        ]
      },
      {
        id: 2,
        blueprints: [],
        y: 7050,
        tag: 'canvas',
        width: 24000,
        height: 8000,
        depth: 2,
        sections: [
          {
            id: 1,
            rowCount: 1,
            variations: [
              {
                id: 1,
                width: 1024,
                height: 768,
                prevalence: 1,
                tag: 'img',
                src: 'images/background/middle.png'
              }
            ]
          }
        ]
      },
      {
        id: 3,
        blueprints: [],
        y: 7232,
        tag: 'canvas',
        width: 32000,
        height: 8000,
        depth: 1,
        sections: [
          {
            id: 1,
            rowCount: 1,
            variations: [
              {
                id: 1,
                width: 1408,
                height: 768,
                prevalence: 1,
                tag: 'img',
                src: 'images/background/near.png'
              }
            ]
          }
        ]
      }
    ]
    const foregroundLayers = [
      {
        id: 1,
        blueprints: [],
        x: 0,
        y: 7456,
        width: 32000,
        height: 8000,
        depth: 0.5,
        tag: 'canvas',
        scale: 16,
        sections: [
          {
            id: 1,
            rowCount: 1,
            variations: [
              {
                id: 1,
                prevalence: 1,
                tag: 'img',
                src: 'images/foreground/lamp/left.png',
                width: 144,
                height: 544
              },
              {
                id: 2,
                prevalence: 1,
                tag: 'img',
                src: 'images/foreground/lamp/right.png',
                width: 144,
                height: 544
              }
            ]
          }
        ]
      },
      {
        id: 2,
        blueprints: [],
        x: 32000,
        y: 7456,
        width: 32000,
        height: 8000,
        depth: 0.5,
        tag: 'canvas',
        scale: 16,
        sections: [
          {
            id: 1,
            rowCount: 1,
            variations: [
              {
                id: 1,
                prevalence: 1,
                tag: 'img',
                src: 'images/foreground/lamp/left.png',
                width: 144,
                height: 544
              },
              {
                id: 2,
                prevalence: 1,
                tag: 'img',
                src: 'images/foreground/lamp/right.png',
                width: 144,
                height: 544
              }
            ]
          }
        ]
      },
      {
        id: 3,
        blueprints: [],
        x: 0,
        y: 6800,
        width: 32000,
        height: 8000,
        depth: 0.25,
        tag: 'canvas',
        scale: 64,
        sections: [
          {
            id: 1,
            rowCount: 1,
            variations: [
              {
                id: 1,
                prevalence: 1,
                tag: 'img',
                src: 'images/foreground/arrow/up-left.png',
                width: 448,
                height: 1248
              },
              {
                id: 2,
                prevalence: 1,
                tag: 'img',
                src: 'images/foreground/arrow/up-right.png',
                width: 448,
                height: 1248
              },
              {
                id: 3,
                prevalence: 1,
                tag: 'img',
                src: 'images/foreground/arrow/down-left.png',
                width: 448,
                height: 1248
              },
              {
                id: 4,
                prevalence: 1,
                tag: 'img',
                src: 'images/foreground/arrow/down-right.png',
                width: 448,
                height: 1248
              },
              {
                id: 5,
                prevalence: 1,
                tag: 'img',
                src: 'images/foreground/arrow/left-up.png',
                width: 1248,
                height: 448
              },
              {
                id: 6,
                prevalence: 1,
                tag: 'img',
                src: 'images/foreground/arrow/left-down.png',
                width: 1248,
                height: 448
              },
              {
                id: 7,
                prevalence: 1,
                tag: 'img',
                src: 'images/foreground/arrow/right-up.png',
                width: 1248,
                height: 448
              },
              {
                id: 8,
                prevalence: 1,
                tag: 'img',
                src: 'images/foreground/arrow/right-down.png',
                width: 1248,
                height: 448
              }
            ]
          }
        ]
      },
      {
        id: 4,
        blueprints: [],
        x: 32000,
        y: 6800,
        width: 32000,
        height: 8000,
        depth: 0.25,
        tag: 'canvas',
        scale: 64,
        sections: [
          {
            id: 1,
            rowCount: 1,
            variations: [
              {
                id: 1,
                prevalence: 1,
                tag: 'img',
                src: 'images/foreground/arrow/up-left.png',
                width: 448,
                height: 1248
              },
              {
                id: 2,
                prevalence: 1,
                tag: 'img',
                src: 'images/foreground/arrow/up-right.png',
                width: 448,
                height: 1248
              },
              {
                id: 3,
                prevalence: 1,
                tag: 'img',
                src: 'images/foreground/arrow/down-left.png',
                width: 448,
                height: 1248
              },
              {
                id: 4,
                prevalence: 1,
                tag: 'img',
                src: 'images/foreground/arrow/down-right.png',
                width: 448,
                height: 1248
              },
              {
                id: 5,
                prevalence: 1,
                tag: 'img',
                src: 'images/foreground/arrow/left-up.png',
                width: 1248,
                height: 448
              },
              {
                id: 6,
                prevalence: 1,
                tag: 'img',
                src: 'images/foreground/arrow/left-down.png',
                width: 1248,
                height: 448
              },
              {
                id: 7,
                prevalence: 1,
                tag: 'img',
                src: 'images/foreground/arrow/right-up.png',
                width: 1248,
                height: 448
              },
              {
                id: 8,
                prevalence: 1,
                tag: 'img',
                src: 'images/foreground/arrow/right-down.png',
                width: 1248,
                height: 448
              }
            ]
          }
        ]
      },
      {
        id: 5,
        blueprints: [],
        x: 64000,
        y: 6800,
        width: 32000,
        height: 8000,
        depth: 0.25,
        tag: 'canvas',
        scale: 64,
        sections: [
          {
            id: 1,
            rowCount: 1,
            variations: [
              {
                id: 1,
                prevalence: 1,
                tag: 'img',
                src: 'images/foreground/arrow/up-left.png',
                width: 448,
                height: 1248
              },
              {
                id: 2,
                prevalence: 1,
                tag: 'img',
                src: 'images/foreground/arrow/up-right.png',
                width: 448,
                height: 1248
              },
              {
                id: 3,
                prevalence: 1,
                tag: 'img',
                src: 'images/foreground/arrow/down-left.png',
                width: 448,
                height: 1248
              },
              {
                id: 4,
                prevalence: 1,
                tag: 'img',
                src: 'images/foreground/arrow/down-right.png',
                width: 448,
                height: 1248
              },
              {
                id: 5,
                prevalence: 1,
                tag: 'img',
                src: 'images/foreground/arrow/left-up.png',
                width: 1248,
                height: 448
              },
              {
                id: 6,
                prevalence: 1,
                tag: 'img',
                src: 'images/foreground/arrow/left-down.png',
                width: 1248,
                height: 448
              },
              {
                id: 7,
                prevalence: 1,
                tag: 'img',
                src: 'images/foreground/arrow/right-up.png',
                width: 1248,
                height: 448
              },
              {
                id: 8,
                prevalence: 1,
                tag: 'img',
                src: 'images/foreground/arrow/right-down.png',
                width: 1248,
                height: 448
              }
            ]
          }
        ]
      },
      {
        id: 6,
        blueprints: [],
        x: 96000,
        y: 6800,
        width: 32000,
        height: 8000,
        depth: 0.25,
        tag: 'canvas',
        scale: 64,
        sections: [
          {
            id: 1,
            rowCount: 1,
            variations: [
              {
                id: 1,
                prevalence: 1,
                tag: 'img',
                src: 'images/foreground/arrow/up-left.png',
                width: 448,
                height: 1248
              },
              {
                id: 2,
                prevalence: 1,
                tag: 'img',
                src: 'images/foreground/arrow/up-right.png',
                width: 448,
                height: 1248
              },
              {
                id: 3,
                prevalence: 1,
                tag: 'img',
                src: 'images/foreground/arrow/down-left.png',
                width: 448,
                height: 1248
              },
              {
                id: 4,
                prevalence: 1,
                tag: 'img',
                src: 'images/foreground/arrow/down-right.png',
                width: 448,
                height: 1248
              },
              {
                id: 5,
                prevalence: 1,
                tag: 'img',
                src: 'images/foreground/arrow/left-up.png',
                width: 1248,
                height: 448
              },
              {
                id: 6,
                prevalence: 1,
                tag: 'img',
                src: 'images/foreground/arrow/left-down.png',
                width: 1248,
                height: 448
              },
              {
                id: 7,
                prevalence: 1,
                tag: 'img',
                src: 'images/foreground/arrow/right-up.png',
                width: 1248,
                height: 448
              },
              {
                id: 8,
                prevalence: 1,
                tag: 'img',
                src: 'images/foreground/arrow/right-down.png',
                width: 1248,
                height: 448
              }
            ]
          }
        ]
      }
    ]
    const prototype = {
      id: null,
      establishedAt: null,
      type: 'neon',
      name: 'Neon District',
      status: '',
      width: 32000,
      height: 8000,
      grid: null,
      roomIds: [],
      characterIds: [],
      vehicleIds: [],
      unwelcomeIds: [],
      backgroundLayers,
      foregroundLayers
    }
    return Object
      .entries(prototype)
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
    let rowCount = -1
    while (rowCount < 8) {
      ++rowCount
      const rowId = getGridIndex(rowCount * 1000)
      const row = grid[rowId] = {}
      let sectionCount = -1
      while (sectionCount < 32) {
        ++sectionCount
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
    while (zerosToAdd > 0) zeros += '0' && --zerosToAdd
    coordinate = zeros + coordinate
    return coordinate.slice(0, 2)
  }

  const assignElementIds = function (layer) {
    Object.entries(layer).forEach(assignElementId, {...this, layer})
  }

  const assignElementId = function ([key, value]) {
    const {state, layer} = this
    if (key === 'tag') layer.elementId = 's' + ++state.elementCount
    else if (Array.isArray(value)) value.forEach(assignElementIds, this)
    return state
  }

  const handleLayer = function (layer) {
    const {sections} = layer
    sections.forEach(handleSection, {...this, layer})
  }

  const handleSection = function (section, sectionIndex) {
    const {variations} = section
    const variationOptions = []
    variations.forEach(pushVariation, {variationOptions})
    pushBlueprints({...this, section, sectionIndex, variationOptions})
  }

  const pushVariation = function (variation, index) {
    const {variationOptions} = this
    let {prevalence} = variation
    while (prevalence) variationOptions.push({variation, index}) && --prevalence
  }

  const pushBlueprints = argumentation => {
    argumentation.rowsDrawn = 0
    startRow(argumentation)
  }

  const startRow = argumentation => {
    const {rowsDrawn, section} = argumentation
    const {rowCount} = section
    argumentation.x = 0
    argumentation.rowY = 0
    if (rowsDrawn < rowCount) pushBlueprint(argumentation)
  }

  const pushBlueprint = argumentation => {
    const {state, x, layer, variationOptions, sectionIndex, isForeground} = argumentation
    if (x >= layer.width) return callStartRow(argumentation)
    const float = Math.random() * variationOptions.length
    const index = Math.floor(float)
    const variationChoice = argumentation.variationChoice = variationOptions[index]
    const {variation, index: variationIndex} = variationChoice
    layer.y && (state.layerY = layer.y)
    const blueprint = {sectionIndex, variationIndex, x, y: state.layerY}
    layer.blueprints.push(blueprint)
    isForeground && handleIsForeground(argumentation)
    argumentation.x += variation.width
    argumentation.rowY = variation.height
    pushBlueprint(argumentation)
  }

  const callStartRow = argumentation => {
    const {state, rowY} = argumentation
    ++argumentation.rowsDrawn
    state.layerY += rowY
    startRow(argumentation)
  }

  const handleIsForeground = argumentation => {
    const {layer, variationChoice} = argumentation
    const {variation} = variationChoice
    if (layer.id < 3) return argumentation.x += 2000
    const float = Math.random() * (3000 - 1000) + 1000
    const gap = Math.floor(float)
    argumentation.x += gap + variation.width
  }

  const callPushEntityPairIfKey = function (keyMatchKit, character) {
    const {characterIds, vehicleIds, _districts} = keyMatchKit
    const {districtId, vehicleKeys, id: characterId} = character
    const district = _districts[districtId]
    const {vehicleIds: vehicleIdsInCharacterDistrict} = district
    vehicleKeys.forEach(pushEntityPairIfKey, {
      vehicleIdsInCharacterDistrict, characterIds, characterId, vehicleIds
    })
  }

  const pushEntityPairIfKey = function (key) {
    const {vehicleIdsInCharacterDistrict, characterIds, characterId, vehicleIds} = this
    const vehicleId = vehicleIdsInCharacterDistrict.find(vehicle => vehicle === key)
    vehicleId && characterIds.push(characterId)
    vehicleId && vehicleIds.push(vehicleId)
  }

  const pushEntityPair = function (keyMatchKit, character) {
    const {characterIds, vehicleIds, _districts} = keyMatchKit
    const {districtId, id: characterId} = character
    const district = _districts[districtId]
    const {vehicleIds: vehicleIdsInCharacterDistrict} = district
    vehicleIdsInCharacterDistrict.forEach(vehicleId => {
      characterIds.push(characterId)
      vehicleIds.push(vehicleId)
    })
    return keyMatchKit
  }

  const detectRowCollisions = function (rowId) {
    const {grid} = this
    const row = grid[rowId]
    Object.keys(row).forEach(detectSectionCollisions, {...this, row})
  }

  const detectSectionCollisions = function (sectionId) {
    const {row, entities} = this
    const section = row[sectionId]
    const entitiesToCompare = section.a
    const comparedEntities = section.b
    comparedEntities.length = 0
    while (entitiesToCompare.length) {
      const entityToCompareId = entitiesToCompare.shift()
      const entityToCompare = entities[entityToCompareId]
      entityToCompare && comparedEntities.forEach(pushCollisions, {...this, entityToCompare})
      entityToCompare && comparedEntities.push(entityToCompare)
    }
    return this
  }

  const pushCollisions = function (comparedEntityId) {
    const {collisionKit, entityToCompare, entities} = this
    const {collisions, interactions} = collisionKit
    const {vehicleIdsA, vehicleIdsB} = collisions
    const {characterIdsA, characterIdsB} = interactions
    const {x, y, width, height, type} = entityToCompare || {}
    const comparedEntity = entities[comparedEntityId]
    const {x: x_, y: y_, width: width_, height: height_, type: type_} = comparedEntity
    const didCollide =
         type === type_
      && x < x_ + width_
      && x + width > x_
      && y < y_ + height_
      && y + height > y_
    if (!didCollide) return this
    type === 'vehicle' && vehicleIdsA.push(entityToCompare)
    type === 'vehicle' && vehicleIdsB.push(comparedEntity)
    type === 'character' && characterIdsA.push(entityToCompare)
    type === 'character' && characterIdsB.push(comparedEntity)
    return this
  }

  var districtKit = {

    create: (state, isMayoral) => {
      const {_districts} = state
      const district = createDistrict()
      const {backgroundLayers, foregroundLayers} = district
      if (!isMayoral) {
        backgroundLayers.forEach(assignElementIds, {state})
        foregroundLayers.forEach(assignElementIds, {state})
        backgroundLayers.forEach(handleLayer, {state})
        foregroundLayers.forEach(handleLayer, {state, isForeground: true})
        district.grid = createGrid()
      }
      district.establishedAt = Date.now()
      const id = district.id = _districts.length
      _districts.push(district)
      return id
    },

    choose: _districts => {
      const district = _districts.find(district => {
        const {id, characterIds} = district
        const {length} = characterIds
        return id && length < 500
      })
      return district && district.id
    },

    emit: (districtId, socket, _districts) => socket.emit('district', _districts[districtId]),

    addToDistrict: (entity, _districts) => {
      const {districtId, type, id: entityId} = entity
      const type_ = type + 'Ids'
      const district = _districts[districtId]
      const entities = district[type_]
      entities.push(entityId)
    },

    checkVehicleKeyMatches: (walkerIds, _districts) => walkerIds.reduce(callPushEntityPairIfKey, {
      characterIds: [], vehicleIds: [], _districts
    }),

    checkVehicleKeylessMatches: (walkerIds, _districts) => walkerIds.reduce(pushEntityPair, {
      characterIds: [], vehicleIds: [], _districts
    }),

    addToGrid: (entities, _districts) => entities.forEach(entity => {
      const {x, y, width, height, district, id} = entity
      const grid = _districts[district].grid
      const xRight = x + width
      const yBottom = y + height
      const rowTop = getGridIndex(y)
      const rowBottom = getGridIndex(yBottom)
      const sectionLeft = getGridIndex(x)
      const sectionRight = getGridIndex(xRight)
      const row = grid[rowTop]
      const section = row && row[sectionLeft]
      section && section.a.push(id)
      if (sectionLeft !== sectionRight) {
        const section = row && row[sectionRight]
        section && section.a.push(id)
      }
      if (rowTop !== rowBottom) {
        const row = grid[rowBottom]
        const section = row && row[sectionLeft]
        section && section.a.push(id)
        if (sectionLeft === sectionRight) return
        const section_ = row && row[sectionRight]
        section_ && section_.a.push(id)
      }
    }),

    detectCollisions: (entities, _districts) => {
      const collisionKit = {
        collisions: {vehicleIdsA: [], vehicleIdsB: []},
        interactions: {characterIdsA: [], characterIdsB: []}
      }
      const {length} = entities
      if (!length) return collisionKit
      _districts.forEach(district => {
        const {grid} = district
        grid && Object.keys(grid).forEach(detectRowCollisions, {grid, entities, collisionKit})
      })
      return collisionKit
    }
  }

  return districtKit
}
