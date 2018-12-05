import FS from 'fs'


export default function mkdir(path, options) {
	let { async, ...fsOpts } = options

	if (async)
		return new Promise(
			(resolve, reject) => FS.mkdir(path, fsOpts, (error) => error ? reject(error) : resolve())
		)

	else
		return FS.mkdirSync(path, fsOpts)

}
