var functionRegEx = /\(([\s\S]*?)\)/,
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




exports.connect = require('./connect').middleware;


global.define = define;
