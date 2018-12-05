import FS from 'fs'


export default function readFile(path, options) {
	let { async, ...fsOpts } = options

	if (async)
		return new Promise(
			(resolve, reject) => FS.readFile(path, fsOpts, (error, content) => error ? reject(error) : resolve(content))
		)

	else
		return FS.readFileSync(path, fsOpts)

}
