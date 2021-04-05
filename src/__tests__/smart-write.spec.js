const FS = require('fs')
const Path = require('path')
const ambifs = require('../fs-ambi')
const smartwrite = require('../smart-write')


describe('smartwrite', () => {

	it(`writes json`, async () => {
		let writtenValue
		let mockWriteFile = jest.spyOn(FS, 'writeFile')
		.mockImplementation((path, value, writeFileOpts, callback) => {
			writtenValue = value
			callback()
		})

		let valueToWrite = { prop: 5 }
		await smartwrite('/path/to/file.ext', valueToWrite, { json: true })

		expect(mockWriteFile).toHaveBeenCalled()
		expect(writtenValue).toEqual(JSON.stringify(valueToWrite))

		mockWriteFile.mockRestore()
	})


	it(`writes plain text`, async () => {
		let writtenValue
		let mockWriteFile = jest.spyOn(FS, 'writeFile')
		.mockImplementation((path, value, writeFileOpts, callback) => {
			writtenValue = value
			callback()
		})

		let valueToWrite = '{ prop: 4 }'
		await smartwrite('/path/to/file.ext', valueToWrite, { json: false })

		expect(mockWriteFile).toHaveBeenCalled()
		expect(writtenValue).toBe(valueToWrite)

		mockWriteFile.mockRestore()
	})


	it(`throws instead of writing an object to text file`, async () => {
		let mockWriteFile = jest.spyOn(FS, 'writeFile')
		.mockImplementation((path, value, writeFileOpts, callback) => callback())

		expect.assertions(1)

		try {
			await smartwrite('/path/to/file.ext', { prop: 5 }, { json: false })
			expect('error to be thrown').toBe(true)

		} catch(error) {
			expect(error instanceof TypeError).toBe(true)

		}

		mockWriteFile.mockRestore()
	})


	it(`throws when value cannot be stringified to JSON`, async () => {
		let mockWriteFile = jest.spyOn(FS, 'writeFile')
		.mockImplementation((path, value, writeFileOpts, callback) => callback())

		let objectA = { name: 'A' }, objectB = { name: 'B' }
		objectA.link = objectB
		objectB.link = objectA

		expect.assertions(1)

		try {
			await smartwrite('/path/to/file.ext', [ objectA, objectB ], { json: false })
			expect('error to be thrown').toBe(true)

		} catch (error) {
			expect(error instanceof TypeError).toBe(true)

		}

		mockWriteFile.mockRestore()
	})


	it(`creates directories if necessary`, async () => {
		let mockWriteFileResponses = [
			[{ code: 'ENOENT' }], // first call should fail b/c directories don't exist
			[null] // second call should succeed
		]

		let mockWriteFile = jest.spyOn(FS, 'writeFile')
		.mockImplementation((path, value, writeFileOpts, callback) => callback.apply(undefined, mockWriteFileResponses.shift()))

		let mockMkdirp = jest.spyOn(ambifs, 'mkdirp')
		.mockImplementation(() => (path, opts, callback) => callback(null, true))

		let filePath = '/path/to/file.ext'
		await smartwrite(filePath, 'some-value')

		expect(mockMkdirp).toHaveBeenCalled()
		expect(mockMkdirp.mock.calls[0][0]).toBe(Path.dirname(filePath))

		mockWriteFile.mockRestore()
		mockMkdirp.mockRestore()
	})


	it(`throws if unable to create directory or file`, async () => {
		// first test: can't create directory
		let mockWriteFileResponses = [
			[{ code: 'ENOENT' }], // first call should fail b/c directories don't exist
			[{ code: 'EACCES' }] // second call should throw no-access error
		]

		let mockWriteFile = jest.spyOn(FS, 'writeFile')
		.mockImplementation((path, value, writeFileOpts, callback) => callback.apply(undefined, mockWriteFileResponses.shift()))

		let mockMkdirp = jest.spyOn(ambifs, 'mkdirp')
		.mockImplementation((path, opts) => Promise.reject({ code: 'EACCES' }))

		let filePath = '/path/to/file.ext'

		expect.assertions(4)

		try {
			await smartwrite(filePath, 'some-value')
			expect('error to be thrown').toBe(true)

		} catch(error) {
			expect(error.code).toBe('EACCES')

		}

		expect(mockMkdirp).toHaveBeenCalled()
		expect(mockMkdirp.mock.calls[0][0]).toBe(Path.dirname(filePath))


		// second test: can't create file

		try {
			await smartwrite(filePath, 'some-value')
			expect('error to be thrown').toBe(true)

		} catch(error) {
			expect(error.code).toBe('EACCES')

		}

		mockMkdirp.mockRestore()
		mockWriteFile.mockRestore()
	})


	it(`returns undefined on success`, async () => {
		let mockWriteFile = jest.spyOn(FS, 'writeFile')
		.mockImplementation((path, value, writeFileOpts, callback) => callback())

		let value = await smartwrite('/path/to/file.ext', 'some-value')

		expect(value).toBeUndefined()

		mockWriteFile.mockRestore()
	})

})
