# easytextfile

Ambidextrous sugar for reading and writing text files. Especially useful for loading and saving data like user preferences and other not-enormous data in OS-conventional locations.

## Installation

1. `npm install --save node-easytextfile`


## Examples

### Attempts to read a file located at `/Users/barney/myFile.json`:

```javascript
var Textfile = require('node-easytextfile');

Textfile.read('/Users/barney/myFile.json')
.then(function(data) {
    // stuff
});
```

### Attempts to store an object as a file located at `/Users/barney/someObject.json`:

```javascript
var Textfile = require('node-easytextfile');

var data = {
    letters: ['a','b','c'],
    number: 5
};

Textfile.write('/Users/barney/someObject.json', data)
.then(function() {
    // it's done
});
```


## Documentation


### <a id='newtextfilepathoptions'>`new Textfile(path, options)`</a>

Configures a new easytextfile. Does not perform any filesystem operations.

Once an easytextfile has been configured, it can be read from and written to. The options set at creation can be overridden in any subsequent call, but such overrides apply to a single operation only.


### <a id='textfilereadpathoptions'>`Textfile.read(path, options)`</a>

Attempts to read the contents of a file:

- if the file doesn't exist, returns `undefined`
- attempts to parse as JSON (unless `options.json = false`)
- will throw if easytextfile configured for JSON but file contents not well-formed

_`path` and `options` are optional._


### <a id='textfilewritepathvalueoptions'>`Textfile.write(path, value, options)`</a>

Attempts to write `value` to disk at the easytextfile's location:

- will create directories if necessary
- can throw permissions-related errors while creating files and directories
- will throw if easytextfile configured for JSON but value cannot be serialized

_`path` and `options` are optional, but `write(path, value)` signature is not supported._

**Warning: `Textfile.write()` with no arguments will erase the contents of your file.**

- `Textfile.write(path, undefined, { json: true })` will write the word `undefined` to the file, which this library will re-interpret as `undefined` upon read, but which other libraries are likely to reject, as `JSON.parse("undefined")` throws.


### <a id='options'>`options`</a>

All easytextfile calls accept an `options` argument. Easytextfile honors the following properties:

| Name | Type | Default | Description |
| ---: | :--- | :---: | :--- |
|     `path` | String            | _required_   | the path to operate on; this can be set and overridden just like any other option |
|    `async` | Boolean           | `true`       | whether filesystem operations should be asynchronous; see [Async](#async) |
| `encoding` | String            | `'utf8'`     | file encoding |
|     `json` | Boolean           | `true`       | whether file contents should be JSON-encoded |
| `replacer` | Function or Array | `null`       | if `options.json`, passed to `JSON.stringify(value, replacer, space)` when writing |
|    `space` | Number or String  | `null`       | if `options.json`, passed to `JSON.stringify(value, replacer, space)` when writing |
|  `reviver` | Function          | `null`       | if `options.json`, passed to `JSON.parse(string, reviver)` when reading |


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

Easytextfile's read and write methods are ambidextrous, meaning that they can be invoked in a blocking or non-blocking style as circumstances require.

By default, `Textfile.read` & `Textfile.write` operate asynchronously, and therefore return promises. However, if `options.async = false`, these methods will block until they can provide their return values. This is useful when e.g. writing data to disk when an Electron app is closing, under which circumstances async file operations are not guaranteed to complete before exit.

_Note: Easytextfile creation is always synchronous._

`async` can be set at creation time, and temporarily overridden at any call site.

```javascript
var Textfile = require('node-easytextfile');

// default configuration is async
var userPrefs = new Textfile(`~/Library/Preferences/MyApp/user1.myapp-settings`);

// read and write prefs asynchronously
var prefUpdatePromise = userPrefs.read()
.then(function(prefData) {
    var newPrefs = Object.assign({}, prefData, { updated: true });
    return userPrefs.write(newPrefs);
});

// read and write prefs synchronously
var prefData = userPrefs.read({ async: false });
var newPrefs = Object.assign({}, prefData, { updated: true });
userPrefs.write(newPrefs, { async: false });
```


### Static & instance-based invocation supported


#### Static invocation

You can read and write without creating objects.

E.g.: write some data to disk and be done:

```javascript
var Textfile = require('node-easytextfile');

function saveManifest(manifest) {
    return Textfile.write('/Users/barney/.myapp/MANIFEST', manifest, { async: false });
}
```


#### Instance-based invocation

If you create an instance using `new`, its initial options will persist for its lifetime, allowing you to re-use the same configuration for working with one or more files.

E.g.: define a "driver" for working with custom data formats:

```javascript
var Textfile = require('node-easytextfile');
var personReviver = require('thirdparty-dataformat-thing').reviver;
var personReplacer = require('thirdparty-dataformat-thing').replacer;

var PersonFile = new Textfile({
    json: true,
    reviver: personReviver,
    replacer: personReplacer
});

function readPersonFile(filingName) {
    var filename = rootDir + '/' + filingName + '.person';
    return PersonFile.read(filename);
}

function writePersonFile(person) {
    var filename = rootDir + '/' + person.filingName + '.person';
    return PersonFile.write(filename, person);
}
```


## Caveats

- Has not (yet) been tested on Windows, or against an NTFS filesystem. I tried to be OS-agnostic, but something may have slipped through.
- Has not been tested on react-native, but it might work.


## Supported Platforms

- node
- Electron
- ~~react-native~~

# License

Copyright © 2017 Tom Rogers <tom@roguevendor.com>

This work is mine. You can't do anything with it yet. Once I declare it finished, I may grant you some rights.
