import {describe, describe as context, it} from 'mocha'
import {expect} from 'chai'
import {descendVehicle} from './descend-vehicle'

describe('descendVehicle', () => {
  context('if the passed vehicle\'s y is less than 7839', () => {
    it('increments its y by 5', () => {
      expect(descendVehicle({y: 0})).to.include({y: 5})
      expect(descendVehicle({y: 7838})).to.include({y: 7843})
    })
  })
  context('if the passed vehicle\'s y is greater than 7838', () => {
    it('sets its y to 7843', () => {
      expect(descendVehicle({y: 7839})).to.include({y: 7843})
      expect(descendVehicle({y: 8000})).to.include({y: 7843})
    })
    it('sets its "isDescending" property to false', () => {
      expect(descendVehicle({y: 7839})).to.include({y: 7843})
      expect(descendVehicle({y: 8000})).to.include({y: 7843})
    })
  })
})
