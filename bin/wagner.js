#!/usr/bin/env node

require('../').server();

var path = require('path')
  , filename = path.join(process.cwd(), process.argv[2])
  ;
  
if(fs.existsSync(filename)) {
  require(filename);
}
