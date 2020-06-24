import {city} from '../prototypes'

export const createCity = state => {
  const {backgroundLayers, foregroundLayers} = city
  backgroundLayers.forEach(assignElementIds, {state})
  foregroundLayers.forEach(assignElementIds, {state})
  backgroundLayers.forEach(handleLayer, {state})
  foregroundLayers.forEach(handleLayer, {state, isForeground: true})
  return city
}

const assignElementIds = function (layer) {
  Object.entries(layer).forEach(assignElementId, {...this, layer})
}

const assignElementId = function ([key, value]) {
  const {state, layer} = this
  if (key === 'tag') layer.elementId = 'scenery-' + ++state.elementCount
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
