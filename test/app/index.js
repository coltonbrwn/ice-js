var express = require('express'),
    router = require('./router.js'),
    Ice = require('ice-js');

var app = express();

app.get('/ice-assets/bundle.js', function(req, res){
  Ice.build({
    routerPath: __dirname+'/router.js',
  }).pipe(res);
});

console.log(router.getLocation());

app.use(router.exportServer());

app.listen(3000, function(){
  console.log('listening on '+3000);
  if(process.send) process.send('listening');
});