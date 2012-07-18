var path = require('path')
  , fs = require('fs');

module.exports = function requireDirectory(dir) {
  var modules = {}
    , files = fs.readdirSync(dir)
    , validFiles = []
    , index = 0
    , options = {}
    , callback
    , done
    , args = Array.prototype.slice.call(arguments, 0);

  args.forEach(function (arg) {
    if ('object' === typeof arg) {
      return options = arg;
    }
    if ('function' === typeof arg && 'undefined' === typeof callback) {
      return callback = arg;
    }
    if ('function' === typeof arg && 'undefined' === typeof done) {
      return done = arg;
    }
  });

  if ('function' !== typeof callback) {
    callback = function callback(module, cb) {
      cb();
    };
  }

  if ('function' !== typeof done) {
    done = function done(err) {
      if (err) throw err;
    };
  }

  if (options.asArray) {
    modules = [];
  }

  files.forEach(function(file) {
    var filePath = path.resolve(dir, file);
    if (!options.predicate || ('function' === typeof options.predicate && options.predicate(filePath))) {
      validFiles.push(filePath);
    }
  });
  
  function processFile() {
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
      
    callback(module, function(err) {
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

  if (validFiles.length > 0) {
    processFile();
  } else {
    done();
  }
  
  return modules;
}