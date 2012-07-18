var path = require('path')
  , fs = require('fs');

module.exports = function requireDirectory(dir, callback, done) {
  var modules = {}
    , files = fs.readdirSync(dir)
    , validFiles = []
    , index = 0
    , processFile
    , options = arguments[arguments.length-1];

  if ('object' !== typeof options) {
    options = {};
  }

  if ('function' !== typeof callback) {
    callback = undefined;
  }

  if ('function' !== typeof done) {
    done = undefined;
  }

  if (options.asArray) {
    modules = [];
  }

  done = done || function done(err) {
    if (err) throw err;
  };

  files.forEach(function(file) {
    var filePath = path.resolve(dir, file)
      , module;
    if (!options.predicate || ('function' === typeof options.predicate && options.predicate(filePath))) {
      validFiles.push(filePath);
    }
  });
  
  processFile = function processFile() {
    var filePath = validFiles[index]
      , name = path.basename(filePath, path.extname(filePath))
      , module = require(filePath);
      
    if (options.asArray) {
      modules.push(module);
    } else {
      if ('function' === typeof module && module.name && module.name.length > 0) {
        name = module.name;
      }
      modules[name] = module;
    }
      
    callback && callback(module, function(err) {
      if (err) {
        done(err); 
      } else {
        index += 1;
        if (index == validFiles.length) {
          done(null); 
        } else {
          processFile();
        }
      }
    });
  };

  processFile();
  
  return modules;
}