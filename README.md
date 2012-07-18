# require-many

Require multiple modules from a single directory at once.

## Installation

`npm install require-many`

## Usage

```js
require('require-many')(dirname[, options][, iterator][, callback])
```

## Examples

```js
var path = require('path')
  , requireMany = require('require-many')
  , modules;

// Return all modules as properties of an object
// (property name is exported function name if specified, otherwise the filename)
modules = requireMany(path.resolve(__dirname, './lib'));

// Return all modules as an array
modules = requireMany(path.resolve(__dirname, './lib'), { asArray: true });

// Pass a predicate to only require certain files within the directory
modules = requireMany(path.resolve(__dirname, './lib'), {
  predicate: function(file) {
    // Exclude any files beginning with an underscore
    return file[0] !== '_';
  }
});

// Apply an iterator to each module and pass a callback
requireMany(path.resolve(__dirname, './lib'), function(module, next) {
  // Do something with module
  next();
}, function(err) {
  // Do something
});
```
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