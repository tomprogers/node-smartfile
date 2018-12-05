import mkdirp_cmd from 'mkdirp'


export default function mkdirp(path, options) {
	let { async, ...fsOpts } = options

	if (async)
		return new Promise(
			(resolve, reject) => mkdirp_cmd(path, fsOpts, (error, made) => error ? reject(error) : resolve(made))
		)

	else
		return mkdirp_cmd.sync(path, fsOpts)

}
