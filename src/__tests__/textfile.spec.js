import Textfile from '../textfile.js'


describe(`Textfile`, () => {

	it(`methods exist`, async () => {
		// static methods
		expect(Textfile.read).toBeDefined()
		expect(Textfile.write).toBeDefined()

		// instance methods
		let file = new Textfile('/test/path')

		expect(file.read).toBeDefined()
		expect(file.write).toBeDefined()
	})

})
