import Path from 'path'
import {
	readFile,
	writeFile,
	mkdir
} from './ambi-fs'

const DefaultOptions = {
	async: true,      // Textfile default
	encoding: 'utf8', // Textfile default
	json: true,       // Textfile default
	replacer: null,   // JSON.stringify default
	reviver: null,    // JSON.parse default
	space: null       // JSON.stringify default
}


class Textfile {
	constructor(path, options) {
		if(!path) throw new Error('invalid path')

		this.path = path

		// bake config from options
		this.config = Object.assign({}, DefaultOptions, options)
	}


	read(path, options) {
		// enforce: instance.read() does not support path arg
		if(this.path && this.config) {
			options = path
			path = this.path
		}

		return smartread(
			path,
			Object.assign({}, this.config, options)
		)
	}


	write(path, value, options) {
		// enforce: instance.write() does not support path arg
		if(this.path && this.config) {
			options = value
			value = path
			path = this.path
		}

		return smartwrite(
			path,
			value,
			Object.assign({}, this.config, options)
		)
	}
}


function smartread(path, options) {
	options = Object.assign({}, DefaultOptions, options)
	let { json, replacer, reviver, space, ...readFileOpts } = options

	if(options.async) {
		return readFile(path, readFileOpts)
		.then(contents => {
			try {
				return (json) ? JSON.parse(contents, reviver) : contents
			} catch(error) {
				// special handling: returned undefined if file is (essentially) blank, or is text "undefined"
				if(error instanceof SyntaxError && ['', 'undefined'].indexOf(String(contents).replace(/\s/gi, '')) >= 0) return
				throw error
			}
		})
		.catch(error => {
			// special handling: return undefined for non-existent files
			if(error.code === 'ENOENT') return
			throw error
		})
	}

	// sync codepath

	let contents
	try {
		contents = readFile(path, readFileOpts)
	} catch(error) {
		// special handling: return undefined for non-existent files
		if(error.code === 'ENOENT') return

		throw error
	}

	try {
		return (json) ? JSON.parse(contents, reviver) : contents
	} catch(error) {
		// special handling: returned undefined if file is (essentially) blank, or is text "undefined"
		if(error instanceof SyntaxError && ['', 'undefined'].indexOf(String(contents).replace(/\s/gi, '')) >= 0) return
		// special handling: return undefined for zero-length
		if(!contents || !contents.length) return
		// allow "undefined" as valid file contents; can easily arise from `smartwrite()`
		if(json && contents === 'undefined') return

		throw error
	}
}


function smartwrite(path, value, options) {
	options = Object.assign({}, DefaultOptions, options)
	let { json, replacer, reviver, space, ...writeFileOpts } = options

	// special handling: when bad value is provided
	if(json) {
		// file is json but value cannot be stringified -- throw now or forever hold your peace
		value = JSON.stringify(value, replacer, space)

	} else {
		if(typeof value === 'undefined') value = ''
		else
		if(typeof value !== 'string') {
			if(options.async) return Promise.reject(new Error(`Textfile.write(value, { json: false }) value must be a string`))
			throw new Error(`Textfile.write(value, { json: false }) value must be a string`)
		}

	}

	// do the work

	if(options.async) {
		return writeFile(path, value, writeFileOpts)
		.catch(error => {
			// we swallow any "dirs don't exist" errors because we can fix that
			if(error.code === 'ENOENT') {
				return mkdirp(path, writeFileOpts)
				.then(() => writeFile(path, value, writeFileOpts))
			}

			// write failed for some other reason, so throw
			throw error
		})
	}

	// sync codepath
	try {
		writeFile(path, value, writeFileOpts)
		return
	} catch(error) {
		if(error.code === 'ENOENT') {
			mkdirp(path, writeFileOpts)
			writeFile(path, value, writeFileOpts)
			return
		}

		throw error
	}
}


function mkdirp(path, opts, extantDirs=[]) {
	let { root:fileRoot , dir , base } = Path.parse(path)
	let all = dir.split(Path.sep)

	if(all.length === extantDirs.length) {
		if(opts.async) return Promise.resolve()
		return
	}

	let mine = all.slice(0, Math.max(2, extantDirs.length + 1))

	if(opts.async) {
		return mkdir(mine.join(Path.sep), opts)
		.catch(error => {
			if(error.code === 'EEXIST') return
			throw error
		})
		.then(() => mkdirp(path, opts, mine))
	}

	try {
		mkdir(mine.join(Path.sep), opts)
	} catch(error) {
		if(error.code !== 'EEXIST') throw error
	}

	return mkdirp(path, opts, mine)
}


Textfile.read = smartread
Textfile.write = smartwrite

export default Textfile
