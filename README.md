# smartfile

Ambidextrous sugar for reading and writing text files. Especially useful for loading and saving data like user preferences and other not-enormous data in OS-conventional locations.

## Installation

- `npm install node-smartfile --save`


## Examples

Attempts to read a file located at `/Users/barney/test.json`.

```js
import Smartfile from 'node-smartfile'

let file = new Smartfile('/Users/barney/test.json')

file.read()
.then(data => {
    // stuff
})
```

Attempts to write an object to a file located at `/Users/barney/new_directory/new_file.json`.

```js
import Smartfile from 'node-smartfile'

let file = new Smartfile('/Users/barney/new_directory/new_file.json')

let data = {
    some_object: {},
    a_number: 5
}

file.write(data)
```


## Documentation


### <a id='newsmartfilepathoptions'>`new Smartfile(path, options)`</a>

Configures a new smartfile. No filesystem operations are performed.

Once a smartfile has been configured, it can be read from and written to. The options set at creation can be overridden in any subsequent call, but such overrides apply to a single operation only.


### <a id='smartfilereadpathoptions'>`Smartfile.read(path, options)`</a>

Attempts to "smart-read" the contents of a file.

- if the file doesn't exist, returns `undefined`
- attempts to parse as JSON (unless `options.json = false`)
- will throw if smartfile configured for JSON but file contents not well-formed

_`path` and `options` are optional._


### <a id='smartfilewritepathvalueoptions'>`Smartfile.write(path, value, options)`</a>

Attempts to write `value` to disk at the specified location.

**Warning: `Smartfile.write()` with no arguments will erase the contents of your file.**

- will create directories if necessary
- can throw permissions-related errors while creating files and directories
- will throw if smartfile configured for JSON but value cannot be serialized

_`path` and `options` are optional, but `write(path, value)` signature is not supported._


### Options

All smartfile calls accept an `options` argument. Smartfile honors the following properties:

- `path`: {String} the path to operate on; this can be overridden just like any other option
- `async`: {Boolean} whether FS operations should be asynchronous (_default: `true`_); see [Async](#async)
- `encoding`: {String} file encoding (_default: `'utf8'`_)
- `json`: {Boolean} whether file contents should be JSON-encoded (_default: `true`_)
- `replacer`: {Function|Array} passed to `JSON.stringify(value, replacer, space)` when writing, if `options.json` (_default: `null`_)
- `space`: {Number|String} passed to `JSON.stringify(value, replacer, space)` when writing, if `json` (_default: `null`_)
- `reviver`: {Function} passed to `JSON.parse(string, reviver)` when reading, if `options.json` (_default: `null`_)

Default options:

```javascript
{
    async: true,
    encoding: 'utf8',
    json: true,
    replacer: null,
    space: null,
    reviver: null
}
```

Any other properties will be passed down to the core nodejs methods, which are:

*  `fs.readFile` & `fs.readFileSync`
*  `fs.writeFile` & `fs.writeFileSync`
*  `fs.mkdir` & `fs.mkdirSync`
*  `fs.access` & `fs.accessSync`


### Async

Smartfile's read and write methods are ambidextrous, meaning that they can be invoked in a blocking or non-blocking style as circumstances require.

By default, `Smartfile.read` & `Smartfile.write` operate asynchronously, and therefore return Promises. However, if `options.async === false`, these methods will block until they can provide their return values. This is useful when e.g. writing data to disk when an Electron app is closing, at which time async file operations are not guaranteed to complete before exit.

_Note: Smartfile creation is always synchronous._

Async can be set at creation time, and temporarily overridden at any call site.

```javascript
import Smartfile from 'node-smartfile'

// default configuration is async
const userPrefs = new Smartfile(`~/Library/Preferences/MyApp/user1.myapp-settings`)

// read and write prefs asynchronously
let prefUpdatePromise = userPrefs.read()
.then(prefData => {
    let newPrefs = Object.assign({}, prefData, { updated: true })
    return userPrefs.write(newPrefs)
})

// read and write prefs synchronously
let prefData = userPrefs.read({ async: false })
let newPrefs = Object.assign({}, prefData, { updated: true })
userPrefs.write(newPrefs, { async: false })
```


## Caveats

- Has not (yet) been tested on Windows, or against an NTFS filesystem. I tried to be OS-agnostic, but something may have slipped through.


## Supported Platforms

- node
- Electron
- ~~react-native~~ (untested, but should work)

# License

Copyright © 2017 Tom Rogers <tom@roguevendor.com>

This work is mine. You can't do anything with it yet. Once I declare it finished, I may grant you some rights.
