import socketIo from 'socket.io-client'
import Bowser from 'bowser'
import {state} from './state'
import {createElement} from './create'
import {handlePlayer, handleEntities} from './handle'
import {adjustCameraSize, control, emitToken, initializeCity} from './do'
import {renderUnsupported} from './render'

const socket = socketIo()
const {camera} = state
const bowser = Bowser.parse(window.navigator.userAgent)
const {browser, platform} = bowser
const isSupported = browser.name === 'Chrome' && platform.type === 'desktop'

if (!isSupported) renderUnsupported()
if (!isSupported) throw new Error('Unsupported browser')

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
