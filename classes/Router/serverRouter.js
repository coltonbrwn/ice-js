require('node-jsx').install({extension: '.jsx'});

var ServerPage = require('../Page/serverPage.js'),
    express = require('express'),
    Backbone = require('backbone');

// Override Backbone to use server-side sync
Backbone.sync = require('backbone-super-sync');

var serverRouter = module.exports = function(iceRouter){

  if (typeof iceRouter !== 'object') throw 'invalid router provided';
  var router = new express.Router();

  iceRouter.entries.forEach(function(entry){

    var path = entry.path;
    var handlerFn  = entry.handler;

    router.get(path, (function(handler){
      return function(req, res, next){
        var page = new ServerPage(req, res);
        handler.call(this.router, page);
      };
    })(handlerFn));

  }.bind(this));

  // app.use(function(req, res){
  //   var page = new ServerPage(req, res);
  //   page.error(404);
  // });

  return router;

}
