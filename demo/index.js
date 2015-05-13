var express = require('express'),
    router = require('../test/app/routers/demo.js'),
    Ice = require('../ice.js'),
    dataAPI = require('../test/app/data_api'),
    fs = require('fs');

var app = express();
var bundleLoc = __dirname+'/bundle.js'


Ice.build(router)
   .pipe(fs.createWriteStream(bundleLoc))
   .on('finish', function(){
      app.listen(3000, function(){
        console.log('listening on '+3000);
        if(process.send) process.send('listening');
      });
   })


app.use('/ice-assets', express.static(__dirname));

app.use('/data', dataAPI);

app.use(router.exportServer());

