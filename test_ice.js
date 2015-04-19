var express = require('express'),
    Ice = require('./ice.js');

Ice.config({
  router: './testrouter.js'
});

var app = express();

app.use(Ice.server());


app.listen(1234);