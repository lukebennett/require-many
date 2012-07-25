# require-many

Require multiple modules at once. Modules can be returned as properties of an object, as an array or iterated over with a callback.

## Installation

`npm install require-many`

## Usage

```js
require('require-many')(paths[, options][, iterator][, callback])
```

`paths` can either be a path to a directory or file, or an array of paths.

`options` can contain any of the following:
 - `asArray` - boolean indicating whether to return modules as an array rather than within an object
 - `predicate` - a function that will be called for each file or directory to allow unwanted modules to be filtered out
 - `recurse` - boolean indicating whether to recurse down through any sub-directories
 - `lazyLoad` - boolean indicating whether to wrap module require in a function for delayed execution

`iterator` will be called for each required module and is passed the module, the path to the file and a callback.

`callback` will be called once all modules have been required.

## Examples

```js
var path = require('path')
  , requireMany = require('require-many')
  , modules;

// Return all modules from a single directory as properties of an object
// (property name is exported function name if specified, otherwise the filename)
modules = requireMany(path.resolve(__dirname, './lib'));

// Return all modules from a single directory as an array
modules = requireMany(path.resolve(__dirname, './lib'), { asArray: true });

// Return specific modules from different locations
modules = requireMany([path.resolve(__dirname, './lib/module1.js'),path.resolve(__dirname, './other/module2.js')]);

// Recurse down through directory and require modules from sub-directories
modules = requireMany(path.resolve(__dirname, './lib'), { recurse: true });

// Return all modules from multiple directories
modules = requireMany([path.resolve(__dirname, './lib'), path.resolve(__dirname, './other')]);

// Pass a predicate to only require certain files within the directory
modules = requireMany(path.resolve(__dirname, './lib'), {
  predicate: function(file) {
    // Exclude any files beginning with an underscore
    return file[0] !== '_';
  }
});

// Apply an iterator to each module and pass a callback
requireMany(path.resolve(__dirname, './lib'), function(module, filePath, next) {
  // Do something with module
  next();
}, function(err) {
  // Do something
});

// Lazy load modules
requireMany(path.resolve(__dirname, './lib'), function(getModule, filePath, next) {
  // Require module
  var module = getModule();
  // Do something with module
  next();
}, function(err) {
  // Do something
});
```

## Known issues

At the moment, if multiple modules are included with the same name (e.g. within different directories), last wins when returning as an object. When using an iterator or returning as an array, each instance will be included.

## Tests

Not yet :( #ashamed

## License (MIT)

Copyright (c) 2012 Luke Bennett &lt;luke@lukebennett.com&gt;

Permission is hereby granted, free of charge, to any person obtaining 
a copy of this software and associated documentation files (the 
'Software'), to deal in the Software without restriction, including 
without limitation the rights to use, copy, modify, merge, publish, 
distribute, sublicense, and/or sell copies of the Software, and to 
permit persons to whom the Software is furnished to do so, subject to 
the following conditions:

The above copyright notice and this permission notice shall be 
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, 
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY 
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, 
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.