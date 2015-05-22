var express = require('express'),
    fs = require('fs'),
    routers = require('./routers/index.js'),
    easyRouter = require('./routers/easyRouter.js'),
    Ice = require('ice-js');

var app = express();

app.get('/ice-assets/bundle.js', function(req, res){
  if(fs.existsSync(__dirname+'/bundle.js')){
    fs.createReadStream(__dirname+'/bundle.js')
      .pipe(res);
  }else{
    Ice.build(routers)
      .pipe(res)
      .pipe(fs.createWriteStream(__dirname+'/bundle.js'));
  }
});

app.use('/data', require('./data_api'));
app.use(easyRouter.make());
app.use(routers.exportServer());

app.listen(3000, function(){
  console.log('listening on '+3000);
  if(process.send) process.send('listening');
});