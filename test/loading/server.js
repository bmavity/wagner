var connect = require('connect')
  , operatic = require('operatic')
  , wagner = require('../../')
  ;

connect(
 wagner.middleware()
, connect.static(__dirname)
).listen(process.env.PORT || 8000);

