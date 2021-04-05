const FS = require('fs')


module.exports = function writeFile( path, string, options ) {
	let { async, ...fsOpts } = options

	if(!async) return FS.writeFileSync(path, string, fsOpts)

	return new Promise(( resolve, reject ) => FS.writeFile(
		path,
		string,
		fsOpts,
		( error ) => error ? reject(error) : resolve()
	))
}
