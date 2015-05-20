var express = require('express'),
    router = require('../test/app/routers/demo.js'),
    Ice = require('../ice.js'),
    fs = require('fs');

var app = express();

var builder = Ice.build(router)
   .pipe(fs.createWriteStream(__dirname+'/bundle.js'));

app.use('/ice-assets', express.static(__dirname));
app.use('/data', require('../test/app/data_api'));

app.use(router.make());

builder.on('finish', function(){
  app.listen(3000, function(){
    console.log('listening on '+3000);
    if(process.send) process.send('listening');
  });
});
