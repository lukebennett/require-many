var path = require('path')
  , fs = require('fs');

module.exports = function requireMany(dirs) {
  var modules = {}
    , dirs = Array.isArray(dirs) ? dirs : [dirs]
    , files = []
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

  function parseDirectory(dir) {
    fs.readdirSync(dir).forEach(function (file) {
      var curPath = path.join(dir, file);
      if (fs.statSync(curPath).isDirectory()) {
        options.recurse && parseDirectory(curPath);
      } else if (!options.predicate || ('function' === typeof options.predicate && options.predicate(curPath))) {
        files.push(curPath);
      }
    });
  };

  function processFile() {
    var filePath = files[index]
      , name = path.basename(filePath, path.extname(filePath))
      , dirname = path.dirname(filePath)
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
        if (index == files.length) {
          done(null); 
        } else {
          processFile();
        }
      }
    });
  };

  dirs.forEach(parseDirectory);

  if (files.length > 0) {
    processFile();
  } else {
    done();
  }
  
  return modules;
}