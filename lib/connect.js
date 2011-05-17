var fs = require('fs'),
    wagnerFile = /\/wagner\/(.+)\.js$/g,
    basePath;

var middleware = function(req, res, next) {
  var match = wagnerFile.exec(req.url),
      matchFile;
  console.log(req.url);
  console.log(match);
  if(match) {
    matchFile = match[1];
    if(matchFile === 'wagner') {
      fs.readFile(__dirname + '/browser.js', function(err, file) {
        res.setHeader('Content-Type', 'text/javascript');
        res.end(file.toString());
      });
    } else {
      fs.readFile(basePath + matchFile + '.js', function(err, file) {
        if(err) {
          next();
        } else {
          res.setHeader('Content-Type', 'text/javascript');
          res.write('(function(wagner){');
          res.write('var module = new wagner.Module(),');
          res.write('define = module.define,');
          res.write('exports = module.exports; ');
          res.write(file.toString());
          res.end('})(wagner);');
        }
      });
    }
  } else {
    next();
  }
};


exports.middleware = function(opts) {
  basePath = opts && opts.basePath;
  return middleware;
};
