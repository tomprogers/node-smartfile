const FS = require('fs')
const smartread = require('../smart-read')


describe('smartread', () => {

	it(`returns undefined if the path does not exist`, async () => {
		let mockReadFile = jest.spyOn(FS, 'readFile')
		.mockImplementation((path, options, callback) => {
			let error = new Error(`ENOENT: no such file or directory, open '${path}'`)
			error.code = 'ENOENT'
			error.errno = -2
			error.syscall = 'open'
			error.path = path

			callback(error)
		})

		let value = await smartread('/path/to/file')

		expect(mockReadFile).toHaveBeenCalled()
		expect(value).toBeUndefined()

		mockReadFile.mockRestore()
	})


	it(`returns undefined if a json file is 0 bytes`, async () => {
		let mockReadFile = jest.spyOn(FS, 'readFile').mockImplementation(async (path, options, callback) => callback(null, ''))

		let value = await smartread('/path/to/file')

		expect(mockReadFile).toHaveBeenCalled()
		expect(value).toBeUndefined()

		mockReadFile.mockRestore()
	})


	it(`returns the empty string if a plain file is 0 bytes`, async () => {
		let mockReadFile = jest.spyOn(FS, 'readFile').mockImplementation(async (path, options, callback) => callback(null, ''))

		let value = await smartread('/path/to/file', { json: false })

		expect(mockReadFile).toHaveBeenCalled()
		expect(value).toBe('')

		mockReadFile.mockRestore()
	})


	it(`returns parsed json`, async () => {
		let mockReadFile = jest.spyOn(FS, 'readFile').mockImplementation(async (path, options, callback) => callback(null, `{"prop":5}`))

		let value = await smartread('/path/to/file')

		expect(mockReadFile).toHaveBeenCalled()
		expect(value).toHaveProperty('prop', 5)

		mockReadFile.mockRestore()
	})


	it(`throws if json file is invalid`, async () => {
		let mockReadFile = jest.spyOn(FS, 'readFile').mockImplementation(async (path, options, callback) => callback(null, `{"prop":12`))

		expect.assertions(2)

		try {
			let value = await smartread('/path/to/file')
			expect('error to be thrown').toBe(true)

		} catch(error) {
			expect(mockReadFile).toHaveBeenCalled()
			expect(error instanceof SyntaxError).toBe(true)

		}

		mockReadFile.mockRestore()
	})

})
