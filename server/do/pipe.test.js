import {describe, it} from 'mocha'
import {expect} from 'chai'
import {pipe} from './pipe'

const increment = number => ++number
const square = number => number ** 2
const getAnswer = number => 'Answer is ' + number

describe('pipe', () => {
  it(
    'takes an argument and any number of functions and calls them '
    + 'sequentially, passing the previous call\'s returned value',
    () => {
      const answer1 = pipe(2, increment, square, getAnswer)
      expect(answer1).to.include('Answer is 9')
      const answer2 = pipe('5', square, increment, getAnswer)
      expect(answer2).to.include('Answer is 26')
    })
})
