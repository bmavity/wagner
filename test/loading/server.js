var connect = require('connect')
  , operatic = require('operatic')
  , wagner = require('../../')
  , path = require('path')
  ;

connect(
  wagner.middleware().add({
    name: 'static js'
  , contentDir: path.join(__dirname, 'js')
  , matcher: '/js'
  })
, connect.static(__dirname)
).listen(process.env.PORT || 8000);

