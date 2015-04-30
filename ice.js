var express = require('express'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream');

module.exports = {

  server: function(opts){
    this.routerPath = opts.routerPath;
    return require('./lib/initServer').call(this);
  }


};