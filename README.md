# smartfile

Sugar for managing text files. Especially useful for loading and saving data like user preferences and other reasonably-sized structured data in OS-conventional locations.

```javascript
// set default options at creation time
new Smartfile(path)
new Smartfile(options)
new Smartfile(path, options)

// read data
file.read()
file.read(path)
file.read(options)
file.read(path, options)
//=> value

// write data
file.write() //> writes a blank file! be careful
file.write(value)
file.write(value, options)
file.write(path, value, options)
//=> undefined
```


## Table of Contents

* [Installation](#installation)
* [Usage](#usage)
  * [Async](#async)
  * [Sync](#sync)
  * [Handling errors](#handling-errors)
* [API reference](#api-reference)
* [Caveats](#caveats)
* [Supported environments](#support)


## Installation

* `npm install node-smartfile --save`

* `yarn add node-smartfile`


## Usage

For a more comprehensive API reference that this polyfill supports, refer to
https://github.github.io/fetch/.

### Async

```javascript
import Smartfile from 'node-smartfile'

const userPrefs = new Smartfile(`~/Library/Preferences/MyApp/user1.myapp-settings`)


function saveUserPrefs(newPrefs=DefaultUserPreferences) {
    return userPrefs.write(newPrefs) // resolves with undefined
    //> directories created, file written
}

function readUserPrefs() {
    return userPrefs.read() // resolves with the content of the file
}
```

### Sync

```javascript
import Smartfile from 'node-smartfile'
const userPrefs = new Smartfile(`~/Library/Preferences/MyApp/user2.myapp-settings`, { async: false })

function getPrefByName(name) {
    let prefs = userPrefs.read()
    return prefs[name]
}
```


### Handling errors

Smartfile methods can throw any error thrown by methods in the native node `fs` module, including:

*  `readFile` & `readFileSync`
*  `writeFile` & `writeFileSync`
*  `mkdir` & `mkdirSync`
*  `access` & `accessSync`

Also, when working with `json` files, you may see any of the errors thrown by `JSON.parse` & `JSON.stringify`:

* `unexpected token %t at position %p` (file contents not valid as JSON)
* stringification failure for objects with circular references

However, Smartfile's "smartness" lies in the fact that it swallows and provides default handling for a few error scenarios:

* `ENOENT` (when attempting to read a path that doesn't exist)
  ignores the error, returns `undefined`
* `EEXIST` (when attempting to create a directory that already exists)
  ignores the error, moves on to create nested directory or write file


## API reference

```javascript
// initialize a smartfile
let file = new Smartfile(path)
let file = new Smartfile(options)
let file = new Smartfile(path, options)
let file = new Smartfile(path, options, initialContent)

// all the options
let file = new Smartfile({
    path: String // required; may be relative or absolute
    
    // whether FS operations should be asynchronous
    async: Boolean, // default: true
    
    // Smartfile overrides some underlying methods by default
    encoding: String, // default: 'utf8'
    
    // read & write will marshall to and from JSON automatically
    json: Boolean, // default: true
    
    // JSON.stringify(value, replacer, space)
    replacer: Function(key, value) | Array // default: null
    space: Number | String // default: null
    
    // JSON.parse(string, reviver)
    reviver: Function(key, value) // default: null
    
    // any other properties are passed down to core nodejs methods
    ...opts
})
```

**Every option can be overriden at any call site.**

```javascript
// e.g. create an async smartfile, then switch to synchronous use
let file = new Smartfile(path) // default async:true

file.write({initial_value:true}) // async write
.then(() => {
    // switch to synchronous use
    let content = file.read({ async:false }) //=> '{"initial_value":true}'
    
    // overrides at .read and .write don't become permanent
    // must continue to specify async:false
    file.write({initial_value:false}, { async: false })
    
    // these both produce the same results
    return file.read() // returns promise that becomes resolution value of write.then
    return file.read({async:false}) // blocks for read, then returns JSON object, which becomes resolution value of write.then
})
//=> resolves with {"initial_value":false}
```

```javascript
// define options for a standard file format, then read and write several files in that format

let pets = {
    'Fluffy': { species: 'cat' , ageInYears: 8 },
    'Puffy': { species: 'dog', ageInYears: 10 },
    'Gruffy': { species: 'cat', ageInYears: 14 }
}

let petfile = new Smartfile({ json: false })

Object.keys(pets).forEach(petName => {
    let petData = pet2customDataFormat(pets[petName])
    // even path can be overriden
    petfile.write(petData, {path:`./data/pets-by-name/${petName}.pet`})
})
```

Reading and writing are trivial.

```javascript

// read data
file.read()
file.read(path)
file.read(options)
file.read(path, options)
//=> value

// write data
file.write() //> writes a blank file! be careful
file.write(value)
file.write(value, options)
file.write(path, value, options)
//=> undefined
```


## Caveats

Has not (yet) been tested on Windows, or against an NTFS filesystem. I tried to be OS-agnostic, but something may have slipped through.


## Support

- node
- Electron
- ~~react-native~~

# License

Copyright © 2017 Tom Rogers  <tom@roguevendor.com>

This work is mine. You can't do anything with it yet. Once I declare it finished, I may grant you some rights.
