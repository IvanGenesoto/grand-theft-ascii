import Redis from 'ioredis'
import {getState} from '.'

const url = 'redis://redistogo:aab5bda2bdcd9e6a118a9b9c79042d50@crestfish.redistogo.com:9908/'
const {NODE_ENV, REDISTOGO_URL = url} = process.env
const redis = new Redis(REDISTOGO_URL)
const isProduction = NODE_ENV === 'production'

getState(redis, isProduction)
