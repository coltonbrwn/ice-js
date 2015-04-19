require('node-jsx').install({extension: '.jsx'});

var express = require('express'),
    path = require('path'),
    callsite = require('callsite'),
    initServer = require('./lib/initServer.js'),
    initClient = require('./lib/initClient.js');


var Ice = function(){
  this.config = {};
}

Ice.prototype = {

  constructor: Ice,

  configure: function(options){
    var stack = callsite();
    var requester = stack[1].getFileName();
    var directory = path.dirname(requester);
    options.routerPath = directory + '/' + options.routerPath;
    this.config = options;
  },

  Model: require('./lib/classes/model.js'),

  Colletion: require('./lib/classes/collection.js'),

  server: function(){
    return initServer.call(this);
  },

  client: function(){
    return initClient.call(this);
  }
}

module.exports = new Ice;