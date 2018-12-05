import DefaultOptions from './default-options.js'
import ambifs from './fs-ambi'
import Path from 'path'


export default function smartwrite(path, value, options) {
	options = { ...DefaultOptions, ...options }

	if(options.async) {
		return write_async(path, value, options)

	} else {
		return write_sync(path, value, options)

	}

}



async function write_async(path, value, options) {
	let {
		json,
		replacer,
		reviver,
		space,
		...writeFileOpts
	} = options

	let finalValue
	if(json) {
		finalValue = JSON.stringify(value)

	} else {
		if (value === undefined) {
			finalValue = ''

		} else if(typeof value !== 'string') {
			throw new TypeError(`${typeof value} is not a string`)

		} else {
			finalValue = value

		}
	}

	try {
		return await ambifs.writeFile(path, finalValue, writeFileOpts)

	} catch(error) {
		// we swallow "dirs don't exist" errors because we can remedy that
		if(error.code === 'ENOENT') {
			await ambifs.mkdirp(Path.dirname(path), writeFileOpts)
			return write_async(path, value, options)
		}

		throw error

	}
}



function write_sync(path, value, options) {
	let {
		json,
		replacer,
		reviver,
		space,
		...writeFileOpts
	} = options

	let finalValue
	if (json) {
		finalValue = JSON.stringify(value)

	} else {
		if (value === undefined) {
			finalValue = ''

		} else if (typeof value !== 'string') {
			throw new Error(`${typeof value} is not a string`)

		}
	}

	try {
		return ambifs.writeFile(path, finalValue, writeFileOpts)

	} catch (error) {
		if(error.code === 'ENOENT') {
			ambifs.mkdirp(Path.dirname(path), writeFileOpts)
			return write_sync(path, value, options)
		}

		throw error

	}
}
