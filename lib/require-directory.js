var path = require('path')
  , fs = require('fs');

module.exports = function requireDirectory(dir, predicate, asArray) {
  var modules = {}
    , files = fs.readdirSync(dir);

  if (predicate && 'function' !== typeof predicate) {
    asArray = !!predicate
    predicate = undefined;
  }
  
  if (asArray) {
    modules = [];
  }

  files.forEach(function(file) {
    var filePath = path.resolve(dir, file)
      , name = path.basename(filePath, path.extname(filePath))
      , module;
    if (!predicate || ('function' === typeof predicate && predicate(filePath))) { 
      module = require(filePath);
      if (asArray) {
        modules.push(module);
      } else {
        if ('function' === typeof module && module.name && module.name.length > 0) {
          name = module.name;
        }
        modules[name] = module;
      }
    }
  });
  
  return modules;
}