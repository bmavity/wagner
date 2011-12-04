var operatic = require('operatic');

var wagnerModuleWrapper = function(file) {
  return [
    ';(function() {'
  , '  var module = new wagner.Module(), exports = module.exports, define = module.define, component = module.component;'
  , file
  , '})();'
  ].join('\n');
};

var middleware = function() {
  return operatic.middleware({
  }).add({
    name: 'wagner'
  , contentDir: __dirname
  , excludes: '/wagner.js'
  , matcher: '/wagner'
  , wrapper: wagnerModuleWrapper
  });
};

var server = function() {
  require('./serverDefine');
};

exports.middleware = middleware;
exports.server = server;
