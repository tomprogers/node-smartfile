const FS = require('fs')


module.exports = function readFile( path, options ) {
	let { async, ...fsOpts } = options

	if(!async) return FS.readFileSync(path, fsOpts)

	return new Promise(( resolve, reject ) => FS.readFile(
		path,
		fsOpts,
		( error, content ) => error ? reject(error) : resolve(content)
	))
}
