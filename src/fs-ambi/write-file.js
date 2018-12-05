import FS from 'fs'


export default function writeFile(path, string, options) {
	let { async, ...fsOpts } = options

	if (async)
		return new Promise(
			(resolve, reject) => FS.writeFile(path, string, fsOpts, (error) => error ? reject(error) : resolve())
		)

	else
		return FS.writeFileSync(path, string, fsOpts)

}
