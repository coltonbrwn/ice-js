var express = require('express'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream');

module.exports = {

  server: function(opts){
    this.routerPath = opts.routerPath;
    return require('./lib/initServer').call(this);
  },

  build: function(opts){
    return browserify('./node_modules/ice-js/lib/initClient.js', {
      paths: ['./node_modules/ice-js/node_modules'],
      transform: ['reactify'],
      ignore: ['node-jsx', 'express']
    }).require(opts.routerPath, {expose: 'ice-router'})
      .bundle()
      .pipe(source('bundle.js'));
  } 
};