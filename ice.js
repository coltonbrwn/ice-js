
var express = require('express'),
    Page = require('./lib/serverPage.js'),
    initServer = require('./lib/initServer.js'),
    initClient = require('./lib/initClient.js');

module.exports = {

  config: function(options){
    this.routerPath = __dirname + '/' + options.router;
  },

  Model: require('./lib/classes/model.js'),

  Colletion: require('./lib/classes/collection.js'),

  Router: require('./lib/classes/router.js'),

  server: function(){
    return initServer.call(this);
  },

  client: function(){
    return initClient.call(this);
  }
}
