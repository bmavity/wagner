var connect = require('connect'),
    wagner = require('../lib/wagner')({
      basePath: __dirname
    });

connect.createServer(
  connect.logger(),
  wagner.connect(),
  connect.static(__dirname + '/')
).listen(8000);
