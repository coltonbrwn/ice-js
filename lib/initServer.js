var nodeJsx = require('node-jsx').install({extension: '.jsx'});

var ServerPage = require('./serverPage.js'),
    express = require('express'),
    Backbone = require('backbone');

module.exports = function(){

  // Override Backbone to use server-side sync
  Backbone.sync = require('backbone-super-sync');

  var app = express();
  var router = require(this.routerPath);

  router.entries.forEach(function(entry){

    var pathString = entry.path;
    var handlerFn  = entry.handler;

    if(pathString.charAt(0) !== '/')
      throw "routes must begin with '/'";

    app.get(pathString, (function(handler){
      return function(req, res, next){
        var page = new ServerPage(req, res);
        handler.call(router, page);
      };
    })(handlerFn));

  });

  // need to set up static routes for bundle.js
  // inside node_modules?

  // app.use(function(req, res){
  //   var page = new ServerPage(req, res);
  //   page.error(404);
  // });

  return app;
}