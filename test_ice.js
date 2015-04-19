require('node-jsx').install({extension: '.jsx'});

var express = require('express'),
    Ice = require('./ice.js');

var app = express();

Ice.config({
  router: './testrouter.js'
});

app.use(Ice.server());

app.listen(1234);