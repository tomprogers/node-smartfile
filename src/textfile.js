const smartread = require('./smart-read')
const smartwrite = require('./smart-write')


class Textfile {

	constructor( path, options ) {
		if (!path) throw new Error('invalid path')

		this.read = ( opts ) => smartread(path, opts)
		this.write = ( value, opts ) => smartwrite(path, value, opts)
	}

}


Textfile.read = smartread
Textfile.write = smartwrite

module.exports = Textfile
