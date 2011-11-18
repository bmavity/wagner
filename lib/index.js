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
    globalWrapper: wagnerModuleWrapper
  }).add({
    name: 'wagner'
  , contentDir: __dirname
  , excludes: '/wagner.js'
  , matcher: '/wagner'
  });
};

var server = function() {
  require('./serverDefine');
};

exports.middleware = middleware;
exports.server = server;
