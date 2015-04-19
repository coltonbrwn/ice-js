var express = require('express'),
    Ice = require('ice-js'),
    path = require('path');

Ice.configure({
  routerPath: './testrouter.js'
});

var app = express();

app.use(Ice.server());

app.listen(1234);