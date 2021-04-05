const DefaultOptions = require('./default-options')
const ambifs = require('./fs-ambi')


module.exports = function smartread( path, options ) {
	options = { ...DefaultOptions, ...options }

	return options.async
		? read_async(path, options)
		: read_sync(path, options)
}


async function read_async( path, options ) {
	let {
		json,
		replacer,
		reviver,
		space,
		...readFileOpts
	} = options

	let contents
	try {
		contents = await ambifs.readFile(path, readFileOpts)

	} catch ( error ) {
		// special handling: return undefined for non-existent files
		if (error.code === 'ENOENT') return

		throw error
	}

	return grokFile(contents, json, reviver)
}


function read_sync( path, options ) {
	let {
		json,
		replacer,
		reviver,
		space,
		...readFileOpts
	} = options

	let contents
	try {
		contents = ambifs.readFile(path, readFileOpts)

	} catch (error) {
		// special handling: return undefined for non-existent files
		if (error.code === 'ENOENT') return

		throw error
	}

	return grokFile(contents, json, reviver)
}


function grokFile( contents, json, reviver ) {
	if (!json) return contents

	try {
		return JSON.parse(contents, reviver)

	} catch (error) {
		// special handling: returned undefined if file is (essentially) blank, or is text "undefined"
		if(error instanceof SyntaxError) {
			let trimmed = String(contents).trim()
			let fileIsEmpty = trimmed === '' || trimmed === 'undefined'

			if(fileIsEmpty) return
		}

		throw error
	}
}
