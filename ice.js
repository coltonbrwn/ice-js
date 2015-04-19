
require('node-jsx').install({extension: '.jsx'});

var express = require('express'),
    Page = require('./lib/serverPage.js'),
    init = require('./lib/init.js');

module.exports = {

  config: function(options){
    this.routerPath = __dirname + '/' + options.router;
  },

  Model: require('./lib/classes/model.js'),

  Colletion: require('./lib/classes/collection.js'),

  Router: require('./lib/classes/router.js'),

  server: function(){
   return init.server.call(this);
  },

  client: require('./lib/init.js').client.bind(this)
}
