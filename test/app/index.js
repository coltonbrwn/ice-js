var express = require('express'),
    tests = require('./routers/testCases.js'),
    Ice = require('ice-js'),
    dataAPI = require('./data_api');

var app = express();

app.get('/ice-assets/bundle.js', function(req, res){
  Ice.build(tests).pipe(res);
});

app.use('/data', dataAPI);

app.use(tests.exportServer());

app.listen(3000, function(){
  console.log('listening on '+3000);
  if(process.send) process.send('listening');
});