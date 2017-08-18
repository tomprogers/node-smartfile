import Path from 'path'
import {
	readFile,
	writeFile,
	mkdir,
	access,
	exists
} from './smartfile-fs'

const DefaultOptions = {
	async: true,      // Smartfile default
	encoding: 'utf8', // Smartfile default
	json: true,       // Smartfile default
	replacer: null,   // JSON.stringify default
	reviver: null,    // JSON.parse default
	space: null       // JSON.stringify default
}


export default class Smartfile {
	constructor(path, options) {
		// if arg is a string, treat it as .path and merge with defaults
		// if arg is hash, merge it directly
		// otherwise, ignore it
		this.config = Object.assign({},
			DefaultOptions,
			options,
			(typeof path === 'string')
				? { path }
				: (Object.keys(path).length > 0)
					? path
					: {}
		)
	}
	
	read(options) {
		return smartread(Object.assign({}, this.config, options))
	}
	
	write(value, options) {
		return smartwrite(value, Object.assign({}, this.config, options))
	}
}


function smartread(options) {
	let { path, json, replacer, reviver, space, ...readFileOpts } = options
	
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


function smartwrite(value, options) {
	let { path, json, replacer, reviver, space, ...writeFileOpts } = options
	
	// special handling: when bad value is provided
	if(json) {
		// file is json but value cannot be stringified -- throw now or forever hold your peace
		value = JSON.stringify(value, replacer, space)
		
	} else {
		if(typeof value === 'undefined') value = ''
		else
		if(typeof value !== 'string') {
			if(options.async) return Promise.reject(new Error(`Smartfile.write(value, { json: false }) value must be a string`))
			throw new Error(`Smartfile.write(value, { json: false }) value must be a string`)
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
