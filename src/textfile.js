import smartread from './smart-read.js'
import smartwrite from './smart-write.js'


class Textfile {

	constructor(path, options) {
		if (!path) throw new Error('invalid path')

		this.read = (opts) => smartread(path, opts)
		this.write = (value, opts) => smartwrite(path, value, opts)
	}

}


Textfile.read = smartread
Textfile.write = smartwrite


export default Textfile
