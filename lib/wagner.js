var functionRegEx = /\(([\s\S]*?)\)/,
    jsFileRegEx = /^[\s\S]*[.js]$/,
    fs = require('fs'),
    path = require('path'),
    basePath,
    modules = {};

var parseDependencies = function(fn) {
  return functionRegEx.
    exec(fn)[1].
    replace(/\s/g, '').
    split(',').
    filter(function(name) {
      return name.length !== 0;
    });
};

var define = function(name, dependencies, factory) {
  var dependencies = parseDependencies(factory);
  factory.apply({}, dependencies.map(function(dep) {
    return resolve(dep);
  }));
};

var resolve = function(name) {
  var fileName = basePath + '/' + name;
  if(!modules[name]) {
    if(path.existsSync(fileName + '.js')) {
      modules[name] = require(fileName);
    } else {
      return require(name);
    }
  }
  return modules[name];
};


var con = function(req, res, next) {
  if(jsFileRegEx.test(req.url)) {
    res.setHeader('Content-Type', 'text/javascript');
    if(req.url === '/wagner/wagner.js') {
      fs.readFile(__dirname + '/browser.js', function(err, file) {
        res.end(file.toString());
      });
    } else {
      fs.readFile(basePath + req.url, function(err, file) {
        res.write('(function(wagner) {\n');
        res.write('  var module = new wagner.Module(),\n');
        res.write('      define = module.define,\n');
        res.write('      exports = module.exports;\n');
        res.write(file.toString());
        res.end('})(wagner);\n');
      });
    }
  } else {
    next();
  }
};


module.exports = function(opts) {
  basePath = (opts && opts.basePath) || __dirname;

  return {
    connect: function() {
      return con;
    }
  };
};


global.define = define;
