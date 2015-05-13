var express = require('express'),
    fs = require('fs'),
    tests = require('./routers/testCases.js'),
    demo = require('./routers/demo.js'),
    routers = require('./routers'),
    Ice = require('ice-js'),
    dataAPI = require('./data_api');

var app = express();

app.get('/ice-assets/bundle.js', function(req, res){
  fs.createReadStream(__dirname+'/bundle.js')
    .on('error', function(){
      return Ice.build(tests)
    }).pipe(res);
});

app.use('/data', dataAPI);
app.use(routers.exportServer());

app.listen(3000, function(){
  console.log('listening on '+3000);
  if(process.send) process.send('listening');
});