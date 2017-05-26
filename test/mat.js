import chai from 'chai'
import mat from '../src/mat'

const expect = chai.expect

describe('mat', () => {
  describe('rand', () => {
    it('flot should generate a random floating number within range', () => {
      let min = 2
      let max = 6
      let num = mat.rand.flot(min, max)
      expect(num).to.be.a('number')
      expect(num % 1 !== 0).to.equal(true)
      expect(num >= min && num < max).to.equal(true)
    })

    it('int should generate a random integer within range', () => {
      let min = 3
      let max = 9
      let num = mat.rand.int(min, max)
      expect(num).to.be.a('number')
      expect(num % 1 === 0).to.equal(true)
      expect(num >= min && num <= max).to.equal(true)
    })

    it('bool should generate a random boolean', () => {
      expect(mat.rand.bool()).to.be.a('boolean')
    })
  })
})
