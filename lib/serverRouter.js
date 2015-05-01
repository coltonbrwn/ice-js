require('node-jsx').install({extension: '.jsx'});

var ServerPage = require('./serverPage.js'),
    express = require('express'),
    Backbone = require('backbone');

// Override Backbone to use server-side sync
Backbone.sync = require('backbone-super-sync');

var serverRouter = module.exports = function(iceRouter){
  this.router = iceRouter;
}

serverRouter.prototype.init = function(){

  var app = express();

  this.router.entries.forEach(function(entry){

    var pathString = entry.path;
    var handlerFn  = entry.handler;

    app.get(pathString, (function(handler){
      return function(req, res, next){
        var page = new ServerPage(req, res);
        handler.call(this.router, page);
      };
    })(handlerFn));

  }.bind(this));

  // need to set up static routes for bundle.js
  // inside node_modules?

  // app.use(function(req, res){
  //   var page = new ServerPage(req, res);
  //   page.error(404);
  // });

  return app;

}