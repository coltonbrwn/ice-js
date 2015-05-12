var express = require('express'),
    router = require('./routers'),
    Ice = require('ice-js');

var app = express();

app.get('/ice-assets/bundle.js', function(req, res){
  Ice.build(router).pipe(res);
});

app.use(router.exportServer());

app.listen(3000, function(){
  console.log('listening on '+3000);
  if(process.send) process.send('listening');
});