import socketIo from 'socket.io-client'
import {state} from './state'
import {createElement} from './create'
import {handlePlayer, handleEntities} from './handle'
import {adjustCameraSize, control, emitToken, initializeCity} from './do'

const socket = socketIo()
const {camera} = state

state.socket = socket
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
