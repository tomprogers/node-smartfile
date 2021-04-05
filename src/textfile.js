const smartread = require('./smart-read')
const smartwrite = require('./smart-write')


class Textfile {

	constructor( path, options ) {
		if(typeof path !== 'string') throw new TypeError('path must be a string')

		this.read = ( opts ) => smartread(path, opts)
		this.write = ( value, opts ) => smartwrite(path, value, opts)
	}

}


Textfile.read = smartread
Textfile.write = smartwrite

module.exports = Textfile
