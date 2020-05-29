import socketIo from 'socket.io-client'

const socket = socketIo()
const callFunction = (argument, function_) => function_(argument)
const pipe = (...functions) => functions.reduce(callFunction)

const camera = {
  followingId: null,
  roomId: null,
  x: 0,
  y: 0,
  tag: 'canvas',
  elementId: 'c0',
  maxWidth: 1280,
  maxHeight: 720,
  style: {}
}

const state = {
  socket,
  pipe,
  camera,
  performance,
  fps: 30,
  tick: 0,
  imagesTotal: 0,
  imagesLoaded: 0,
  player: {},
  delayKit: {},
  entitiesBuffer: [],
  predictionBuffer: [],
  $game: document.getElementById('game')
}

const createElement = function (component) {
  const {state} = this
  const {$game, camera} = state
  const {tag, elementId, src, width, height} = component
  const $element = document.createElement(tag)
  $element.id = elementId
  $game.appendChild($element)
  component === camera || $element.classList.add('hidden')
  width && ($element.width = width)
  height && ($element.height = height)
  if (!src) return state
  ++state.imagesTotal
  $element.src = src
  $element.onload = () => ++state.imagesLoaded
  return state
}

const adjustCameraSize = function () {
  const {state} = this
  const {camera} = state
  const {style: style_, maxWidth, maxHeight, elementId} = camera
  const horizontalMargin = (innerWidth - maxWidth) / 2 + 'px'
  const verticalMargin = (innerHeight - maxHeight) / 2 + 'px'
  const $camera = document.getElementById(elementId)
  const {style} = $camera || {}
  if (innerWidth < maxWidth) {
    camera.width = innerWidth
    style_.marginLeft = 0
    style_.marginRight = 0
    $camera && ($camera.width = innerWidth)
    $camera && (style.marginLeft = 0)
    $camera && (style.marginRight = 0)
  }
  else {
    camera.width = maxWidth
    style_.marginLeft = horizontalMargin
    style_.marginRight = horizontalMargin
    $camera && ($camera.width = maxWidth)
    $camera && (style.marginLeft = horizontalMargin)
    $camera && (style.marginRight = horizontalMargin)
  }
  if (innerHeight < maxHeight) {
    camera.height = innerHeight
    style_.marginTop = 0
    style_.marginBottom = 0
    $camera && ($camera.height = innerHeight)
    $camera && (style.marginTop = 0)
    $camera && (style.marginBottom = 0)
  }
  else {
    camera.height = maxHeight
    style_.marginTop = verticalMargin
    style_.marginBottom = verticalMargin
    $camera && ($camera.height = maxHeight)
    $camera && (style.marginTop = verticalMargin)
    $camera && (style.marginBottom = verticalMargin)
  }
  return state
}

const emitToken = function () {
  const {state, socket} = this
  const {player} = state
  const {token} = player
  socket.emit('token', token)
}

const handlePlayer = function (player) {
  const {state} = this
  const {camera} = state
  const {characterId} = player
  state.player = player
  camera.followingId = characterId
}

const handleEntities = function (entities) {
  const {state} = this
  const {socket, entitiesBuffer, entities: entities_} = state
  const [mayor] = entities
  const {timestamp} = mayor
  socket.emit('timestamp', timestamp)
  if (!entities_) entities.forEach(createElement.bind({state}))
  entitiesBuffer.push(entities)
}

function initializeCity(city) {
  const {state} = this
  const {backgroundLayers, foregroundLayers} = city
  state.city = city
  backgroundLayers.forEach(createElements.bind({state}))
  foregroundLayers.forEach(createElements.bind({state}))
  checkImagesLoaded.call(this)
}

const initiateCity = state => {
  const {city} = state
  const {backgroundLayers, foregroundLayers} = city
  backgroundLayers.forEach(drawBlueprints)
  foregroundLayers.forEach(drawBlueprints)
  shiftEntitiesBuffer(state, true)
}

function createElements(component) {
  const {tag, sections, variations} = component
  tag && createElement.call(this, component)
  sections && sections.map(createElements.bind(this))
  variations && variations.map(createElements.bind(this))
}

function checkImagesLoaded() {
  const {state} = this
  const {timeoutId, imagesLoaded, imagesTotal} = state
  clearTimeout(timeoutId)
  if (imagesLoaded === imagesTotal) return initiateCity(state)
  state.timeoutId = setTimeout(checkImagesLoaded.bind(this), 50)
}

const drawBlueprints = layer => {
  const {blueprints} = layer
  blueprints.forEach(drawBlueprint, {layer})
}

const drawBlueprint = function (blueprint) {
  const {layer} = this
  const {sections, elementId, scale} = layer
  const {sectionIndex, variationIndex} = blueprint
  const section = sections[sectionIndex]
  const {variations} = section
  const variation = variations[variationIndex]
  const {width, height} = variation
  const $variation = document.getElementById(variation.elementId)
  const $layer = document.getElementById(elementId)
  const context = $layer.getContext('2d')
  scale && context.scale(scale, scale)
  const x = scale ? blueprint.x / scale : blueprint.x
  const y = scale ? blueprint.y / scale : blueprint.y
  context.drawImage($variation, 0, 0, width, height, x, y, width, height)
  context.setTransform(1, 0, 0, 1, 0, 0)
}

const shiftEntitiesBuffer = (state, isInitial) => {
  const {shiftingTimeoutId, entitiesBuffer, fps, ratioIndex, pipe} = state
  const {length} = entitiesBuffer
  const shiftEntitiesBufferWithThese = shiftEntitiesBuffer.bind(null, state, isInitial)
  const delay = 1000 / fps
  clearTimeout(shiftingTimeoutId)
  if (length <= 2 || ratioIndex % 3) return isInitial && (state.shiftingTimeoutId = setTimeout(
    shiftEntitiesBufferWithThese, delay
  ))
  while (entitiesBuffer.length > 2) entitiesBuffer.shift()
  const [oldEntities, entities] = entitiesBuffer
  state.oldEntities = oldEntities
  state.entities = entities
  pipe(state, getPredictionIndex, comparePrediction, reconcilePlayerCharacter)
  state.ratioIndex = 0
  isInitial && refresh(state)
}

const getPredictionIndex = state => {
  const {predictionBuffer, entities, player} = state
  const {characterId} = player
  const character = entities[characterId]
  const {tick: tick_} = character
  const index = predictionBuffer.findIndex(({tick}) => tick === tick_)
  return {index, state}
}

const comparePrediction = ({index, state}) => {
  if (index === -1) return {index: 0, state}
  const {predictionBuffer, player, entities} = state
  const {characterId, maxSpeed} = player
  const character = entities[characterId]
  const prediction = predictionBuffer[index]
  const {x} = character || {}
  const {x: x_} = prediction || {}
  const didPredict = Math.abs(x - x_) <= maxSpeed
  return {didPredict, index, state}
}

function reconcilePlayerCharacter({didPredict, index, state}) {
  const {player, predictionBuffer, oldEntities, entities} = state
  const {characterId} = player
  const character = oldEntities[characterId]
  const newCharacter = entities[characterId]
  const {x, direction} = character || {}
  const {drivingId} = entities
  didPredict && !drivingId && (newCharacter.x = x)
  didPredict && !drivingId && (newCharacter.direction = direction)
  if (didPredict) return state
  const predictionBuffer_ = predictionBuffer.slice(index)
  predictionBuffer.length = 0
  if (drivingId) return state
  predictionBuffer_.forEach(({input}, index) => {
    index && updatePlayerCharacterBehavior(input, state)
    index && updatePlayerCharacterLocation(state)
    updatePredictionBuffer(input, state)
  })
  return state
}

const refresh = state => {
  const {performance, player, entities} = state
  const {characterId} = player
  const character = entities[characterId]
  const {drivingId} = character
  const tick = ++state.tick
  const input = {...player.input, tick}
  state.refreshingStartTime = performance.now()
  socket.emit('input', input)
  shiftEntitiesBuffer(state)
  setInterpolationRatio(state)
  drivingId || updatePlayerCharacterBehavior(input, state)
  drivingId || updatePlayerCharacterLocation(state)
  drivingId || updatePredictionBuffer(input, state)
  updateCamera(state)
  render(state)
  deferRefresh(state)
}

const setInterpolationRatio = state => {
  const ratios = [
    0,
    1 / 3,
    2 / 3,
    1,
    4 / 3,
    5 / 3,
    2,
    7 / 3,
    8 / 3,
    3
  ]
  const {ratioIndex} = state
  const index = ratioIndex === 9 ? 9 : state.ratioIndex++
  state.ratio = ratios[index]
  return state
}

function updatePredictionBuffer(input, state) {
  const {player, entities, predictionBuffer} = state
  const {characterId} = player
  const character = entities[characterId]
  const {tick} = input || {}
  const {x} = character
  const prediction = {x, tick, input}
  predictionBuffer.push(prediction)
  predictionBuffer.length > 60 && predictionBuffer.shift()
}

function updatePlayerCharacterBehavior(input, state) {
  const {player, entities} = state
  const {characterId} = player
  const character = entities[characterId]
  const {direction, maxSpeed} = character
  const {left, right} = input
  character.speed = left || right ? maxSpeed : 0
  character.direction =
      right ? 'right'
    : left ? 'left'
    : direction
}

function updatePlayerCharacterLocation(state) {
  const {player, city, entities} = state
  const {characterId} = player
  const character = entities[characterId]
  const {x, speed, direction, width} = character
  const maxX = city.width - width
  if (speed <= 0) return state
  character.x = direction === 'left' ? x - speed : x + speed
  character.x < 0 && (character.x = 0)
  character.x > maxX && (character.x = maxX)
}

const render = state => {
  const {city, entities} = state
  const {backgroundLayers, foregroundLayers} = city
  backgroundLayers.forEach(renderLayer, {state})
  entities.forEach(renderEntity, {state})
  foregroundLayers.forEach(renderLayer, {state})
}

const updateCamera = state => {
  const {city, camera, entities} = state
  const {followingId} = camera
  if (!followingId) return state
  const entity = entities[followingId]
  const {drivingId, passengingId} = entity
  const entityId = drivingId || passengingId || followingId
  const entity_ = entityId === followingId ? entity : entities[entityId]
  const entityX = interpolateProperty('x', entityId, state)
  const entityY = interpolateProperty('y', entityId, state)
  const cameraX = camera.x = Math.round(entityX + entity_.width / 2 - camera.width / 2)
  const cameraY = camera.y = Math.round(entityY + entity_.height / 2 - camera.height / 2)
  const maxX = city.width - camera.width
  const maxY = city.height - camera.height
  cameraX < 0 && (camera.x = 0)
  cameraX > maxX && (camera.x = maxX)
  cameraY < 0 && (camera.y = 0)
  cameraY > maxY && (camera.y = maxY)
  return state
}

const renderLayer = function (layer) {
  const {state} = this
  const {camera, entities, city} = state
  const {followingId} = camera
  const entity = entities[followingId]
  const {drivingId, passengingId} = entity
  const entityId = drivingId || passengingId || followingId
  const entity_ = entityId === followingId ? entity : entities[entityId]
  const entityX = interpolateProperty('x', entityId, state)
  const $layer = document.getElementById(layer.elementId)
  const $camera = document.getElementById(camera.elementId)
  const context = $camera.getContext('2d')
  const layerX = layer.x || 0
  const cameraX = Math.round((entityX + entity_.width / 2) / layer.depth - camera.width / 2 / layer.depth - layerX)
  const maxX = Math.round(city.width / layer.depth - camera.width / layer.depth - layerX)
  const cameraX_ =
      cameraX > maxX ? maxX
    : !layer.x && cameraX < 0 ? 0
    : cameraX
  context.drawImage(
    $layer,
    cameraX_,
    camera.y,
    camera.width,
    camera.height,
    0,
    0,
    camera.width,
    camera.height
  )
}

function renderEntity(entity) {
  const {state} = this
  const {camera} = state
  const {id: entityId, drivingId, passengingId, direction, previousDirection} = entity || {}
  if (!entity || drivingId || passengingId) return
  const entityX = interpolateProperty('x', entityId, state)
  const entityY = interpolateProperty('y', entityId, state)
  let xInCamera = entityX - camera.x
  const yInCamera = Math.round(entityY - camera.y)
  const isOffScreen = isEntityOffScreen({xInCamera, yInCamera, entity, camera})
  if (isOffScreen) return
  const $entity = document.getElementById(entity.elementId)
  const $camera = document.getElementById(camera.elementId)
  const context = $camera.getContext('2d')
  const shouldFlip = shouldEntityBeFlipped(direction, previousDirection)
  shouldFlip && context.scale(-1, 1)
  shouldFlip && (xInCamera = -entityX + camera.x - entity.width)
  xInCamera = Math.round(xInCamera)
  context.drawImage($entity, xInCamera, yInCamera)
  context.setTransform(1, 0, 0, 1, 0, 0)
}

const isEntityOffScreen = ({xInCamera, yInCamera, entity, camera}) =>
     xInCamera > camera.width
  || xInCamera < 0 - entity.width
  || yInCamera > camera.height
  || yInCamera < 0 - entity.height

const shouldEntityBeFlipped = (direction, previousDirection) =>
     direction === 'left'
  || direction === 'up-left'
  || direction === 'down-left'
  || (direction === 'up' && previousDirection === 'left')
  || (direction === 'up' && previousDirection === 'up-left')
  || (direction === 'up' && previousDirection === 'down-left')
  || (direction === 'down' && previousDirection === 'left')
  || (direction === 'down' && previousDirection === 'up-left')
  || (direction === 'down' && previousDirection === 'down-left')

const interpolateProperty = (propertyName, entityId, state) => {
  const {entitiesBuffer, ratio, player} = state
  const {characterId} = player
  const [entitiesA, entitiesB] = entitiesBuffer
  const entityA = entitiesA[entityId]
  const entityB = entitiesB[entityId]
  if (!entityA || !entityB) return
  const valueA = entityA[propertyName]
  const valueB = entityB[propertyName]
  if (entityId === characterId && propertyName === 'x') return valueB
  const difference = valueB - valueA
  const value = valueA + difference * ratio
  return value
}

const deferRefresh = state => {
  const {delayKit, fps, performance, refreshingStartTime} = state
  const millisecondsPerFrame = 1000 / fps
  const refreshWithState = refresh.bind(null, state)
  delayKit.loopStartTime || (delayKit.loopStartTime = performance.now() - millisecondsPerFrame)
  delayKit.millisecondsAhead || (delayKit.millisecondsAhead = 0)
  const refreshDuration = performance.now() - refreshingStartTime
  const loopDuration = performance.now() - delayKit.loopStartTime
  const delayDuration = loopDuration - refreshDuration
  delayKit.loopStartTime = performance.now()
  delayKit.shouldCheckForSlowdown && compensateIfShould(delayDuration, delayKit)
  delayKit.millisecondsAhead += millisecondsPerFrame - loopDuration
  delayKit.delay = millisecondsPerFrame + delayKit.millisecondsAhead - refreshDuration
  clearTimeout(delayKit.timeoutId)
  if (delayKit.delay < 5) return (delayKit.shouldCheckForSlowdown = false) || refreshWithState()
  if (!delayKit.hasSlowdown) {
    delayKit.shouldCheckForSlowdown = true
    delayKit.timeoutId = setTimeout(refreshWithState, delayKit.delay - 2)
    return
  }
  delayKit.delay *= delayKit.slowdownCompensation
  if (delayKit.delay >= 14) {
    delayKit.shouldCheckForSlowdown = true
    delayKit.hasSlowdown = false
    delayKit.timeoutId = setTimeout(refreshWithState, delayKit.delay - 2)
    return
  }
  if (delayKit.delay < 7) return refreshWithState()
  delayKit.shouldCheckForSlowdown = true
  delayKit.hasSlowdown = false
  delayKit.timeoutId = setTimeout(refreshWithState, 0)
}

const compensateIfShould = (delayDuration, delayKit) =>
     delayDuration > delayKit.delay * 1.2
  && (delayKit.hasSlowdown = true)
  && (delayKit.slowdownCompensation = delayKit.delay / delayDuration)

function control({key}) {
  const {state, isDown} = this
  const {player} = state
  const {input} = player
  if (key === 'a' || key === 'A' || key === 'ArrowLeft') isDown
    ? input.left = true
    : input.left = false
  if (key === 'd' || key === 'D' || key === 'ArrowRight') isDown
    ? input.right = true
    : input.right = false
  if (key === 'w' || key === 'W' || key === 'ArrowUp') isDown
    ? input.up = true
    : input.up = false
  if (key === 's' || key === 'S' || key === 'ArrowDown') isDown
    ? input.down = true
    : input.down = false
  if (key === ' ' || key === 'Enter') isDown
    ? input.action = true
    : input.action = false
}

window.addEventListener('resize', adjustCameraSize.bind({state}), false)
window.addEventListener('keydown', control.bind({state, isDown: true}))
window.addEventListener('keyup', control.bind({state}))
socket.on('request_token', emitToken.bind({state, socket}))
socket.on('city', initializeCity.bind({state}))
socket.on('player', handlePlayer.bind({state}))
socket.on('entity', createElement.bind({state}))
socket.on('entities', handleEntities.bind({state}))
createElement.call({state}, camera)
adjustCameraSize.call({state})
