'use strict'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)
const expect = chai.expect
const assert = chai.assert

import mockfs from 'mock-fs'


import Smartfile from '../src'


describe(`Smartfile`, function() {
	
	describe(`.read()`, function() {
		
		before(function() {
			mockfs({
				'/Users/testman/SMARTFILE/test/dir/file.blank': '',
				'/Users/testman/SMARTFILE/test/dir/file.txt': 'hello',
				'/Users/testman/SMARTFILE/test/dir/file-undef.json': 'undefined',
				'/Users/testman/SMARTFILE/test/dir/file-false.json': 'false',
				'/Users/testman/SMARTFILE/test/dir/file.json-bad': '{"is_broken:true',
				'/Users/testman/SMARTFILE/test/dir/file.json': '{"it_reads":true}'
			})
		})
		
		it(`!exists(dir) //> undefined`, function() {
			let sf = new Smartfile('/Users/testman/SMARTFILE/fiction/dir/file.fiction')
			
			return assert.eventually.equal(
				sf.read(),
				undefined,
				`resolves with undefined when directories don't exist`
			)
		})
		
		it(`!exists(file) //> undefined`, function() {
			let sf = new Smartfile('/Users/testman/SMARTFILE/test/dir/file.fiction')
			
			return assert.eventually.equal(
				sf.read(),
				undefined,
				`resolves with undefined when the target file doesn't exist`
			)
		})
		
		it(`0 bytes //> undefined | ''`, function() {
			let sf1 = new Smartfile('/Users/testman/SMARTFILE/test/dir/file.blank')
			let sf2 = new Smartfile('/Users/testman/SMARTFILE/test/dir/file.blank', { json: false })
			
			return Promise.all([
				assert.eventually.equal(
					sf1.read(),
					undefined,
					`resolves with undefined when file contains empty string`
				),
				assert.eventually.equal(
					sf2.read(),
					'',
					`resolves with undefined when file contains empty string`
				)
			])
		})
		
		it(`!json //> text`, function() {
			let sf1 = new Smartfile('/Users/testman/SMARTFILE/test/dir/file.json', { json: false })
			let sf2 = new Smartfile('/Users/testman/SMARTFILE/test/dir/file-undef.json', { json: false })
			let sf3 = new Smartfile('/Users/testman/SMARTFILE/test/dir/file-false.json', { json: false })
			let sf4 = new Smartfile('/Users/testman/SMARTFILE/test/dir/file.json-bad', { json: false })
			
			return Promise.all([
				assert.eventually.equal(
					sf1.read(),
					`{"it_reads":true}`,
					`reads standard json correctly`
				),
				assert.eventually.equal(
					sf2.read(),
					`undefined`,
					`recognizes "undefined" as undefined`
				),
				assert.eventually.equal(
					sf3.read(),
					`false`,
					`understands a file that contains only one scalar`
				),
				assert.eventually.equal(
					sf4.read(),
					`{"is_broken:true`,
					`works fine when content isn't valid JSON`
				)
			])
		})
		
		it(`json //> undefined | scalar | object | Error`, function() {
			let sf1 = new Smartfile('/Users/testman/SMARTFILE/test/dir/file.json')
			let sf2 = new Smartfile('/Users/testman/SMARTFILE/test/dir/file-undef.json')
			let sf3 = new Smartfile('/Users/testman/SMARTFILE/test/dir/file-false.json')
			let sf4 = new Smartfile('/Users/testman/SMARTFILE/test/dir/file.json-bad')
			
			return Promise.all([
				assert.eventually.deepEqual(
					sf1.read(),
					{it_reads:true},
					`reads standard json correctly`
				),
				assert.eventually.equal(
					sf2.read(),
					undefined,
					`recognizes "undefined" as undefined`
				),
				assert.eventually.equal(
					sf3.read(),
					false,
					`understands a file that contains only one scalar`
				),
				assert.isRejected(
					sf4.read(),
					SyntaxError
					// `rejects with SyntaxError when file contents not valid JSON`
				)
			])
		})
	})
	
	after(function() {
		mockfs.restore()
	})
	
})
