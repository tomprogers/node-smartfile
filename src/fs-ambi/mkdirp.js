const mkdirp_cmd = require('mkdirp')


module.exports = function mkdirp( path, options ) {
	let { async, ...fsOpts } = options

	if(!async) return mkdirp_cmd.sync(path, fsOpts)

	return new Promise(( resolve, reject ) => mkdirp_cmd(
		path,
		fsOpts,
		( error, made ) => error ? reject(error) : resolve(made)
	))
}
