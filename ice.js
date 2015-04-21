require('node-jsx').install({extension: '.jsx'});

var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    callsite = require('callsite'),
    initServer = require('./lib/initServer.js'),
    initClient = require('./lib/initClient.js');


var Ice = function(){
  var configFile;
  this.config = {};
  if(configFile = fs.readFileSync(__dirname+'/../../ice-config.json')){
    configObj = JSON.parse(configFile.toString());
    this.config.routerPath = __dirname+'/../../'+configObj.routerPath;
    this.config.buildDir   = __dirname+'/../../'+configObj.buildDir;
  }else{
    throw 'no config found'
  }
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

  Collection: require('./lib/classes/collection.js'),

  server: function(){
    return initServer.call(this);
  },

  client: function(){
    return initClient.call(this);
  },

  gulp: function(){
    var gulp = require('gulp'),
        browserify = require('gulp-browserify');

    return function(){
      var buildDir = this.config.buildDir;
      return gulp.src(__dirname+'/lib/client.js')
        .pipe(browserify({
          insertGlobals: true,
          fullPaths: true, 
          transform: ['reactify']
        }))
        .pipe(gulp.dest(this.config.buildDir));

    }.bind(this);
  }
  
}

module.exports = new Ice;