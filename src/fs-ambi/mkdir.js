const FS = require('fs')


module.exports = function mkdir( path, options ) {
	let { async, ...fsOpts } = options

	if (!async) return FS.mkdirSync(path, fsOpts)

	return new Promise(( resolve, reject ) => FS.mkdir(
		path,
		fsOpts,
		( error ) => error ? reject(error) : resolve()
	))
}
