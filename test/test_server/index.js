var express = require('express'),
    router = require('./router.js');

var app = express();

app.use('/ice-assets', express.static(__dirname));

app.use(router.exportServer());

app.listen(3000, function(){
  console.log('listening on '+3000);
  if(process.send) process.send('listening');
});