import FS from 'fs'


export const readFile = (path, options) => {
	let { async, ...fsOpts } = options

	if(async) return new Promise((resolve, reject) => FS.readFile(path, fsOpts, (error, content) => error ? reject(error) : resolve(content)))
	else return FS.readFileSync(path, fsOpts)
}

export const writeFile = (path, string, options) => {
	let { async, ...fsOpts }  = options

	if(async) return new Promise((resolve, reject) => FS.writeFile(path, string, fsOpts, (error) => error ? reject(error) : resolve()))
	else return FS.writeFileSync(path, string, fsOpts)
}

export const mkdir = (path, options) => {
	let { async, ...fsOpts } = options

	if(async) return new Promise((resolve, reject) => FS.mkdir(path, fsOpts, (error) => error ? reject(error) : resolve()))
	else return FS.mkdirSync(path, fsOpts)
}

export const access = (path, mode, options) => {
	let { async, ...fsOpts } = options

	if(async) return new Promise((resolve, reject) => FS.access(path, mode, (error) => error ? reject(error) : resolve(true)))
	else return FS.accessSync(path, mode)
}

export const exists = (path, options) => {
	// based on stuff I've read, checking for read+write permission sounds like better method for existence check
	return access(path, FS.constants.R_OK | FS.constants.W_OK, options)
}
