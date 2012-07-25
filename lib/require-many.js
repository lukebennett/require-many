var path = require('path')
  , fs = require('fs');

module.exports = function requireMany(paths) {
  var modules = {}
    , paths = Array.isArray(paths) ? paths : [paths]
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
    callback = function callback(module, filePath, cb) {
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

  function parsePath(_path) {
    if (path.existsSync(_path)) {
      if (fs.statSync(_path).isDirectory()) {
        fs.readdirSync(_path).forEach(function (file) {
          var curPath = path.join(_path, file);
          if (fs.statSync(curPath).isDirectory()) {
            options.recurse && parsePath(curPath);
          } else if (!options.predicate || ('function' === typeof options.predicate && options.predicate(curPath))) {
            files.push(curPath);
          }
        });
      } else {
        files.push(_path);
      }
    }
  };

  function processFile() {
    var filePath = files[index]
      , name = path.basename(filePath, path.extname(filePath))
      , dirname = path.dirname(filePath)
      , module;
      
    if (options.lazyLoad) {
      module = function() {
        return require(filePath);
      };
    } else {
      module = require(filePath); 
    }
      
    if (options.asArray) {
      modules.push(module);
    } else {
      if ('function' === typeof module && module.name && module.name.length > 0) {
        name = module.name;
      }
      modules[name] = module;
    }
      
    callback(module, filePath, function(err) {
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

  paths.forEach(parsePath);

  if (files.length > 0) {
    processFile();
  } else {
    done();
  }
  
  return modules;
}