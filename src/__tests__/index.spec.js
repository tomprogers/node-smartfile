const theFunc = require('../index.js')
const fs = require('../fs-ambi')


describe(`Test`, () => {

	it(`runs tests`, async () => {
		expect(true).toBe(true)
	})

	it(`works`, async () => {
		let theValue = theFunc()
		expect(theValue).toBe(5)
	})

})
