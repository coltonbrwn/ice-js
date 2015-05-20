require('node-jsx').install({extension: '.jsx'});

var ServerPage = require('../Page/serverPage.js'),
    express = require('express');

var serverRouter = module.exports = function(iceRouter){

  if (typeof iceRouter !== 'object') throw 'invalid router provided';
  var router = new express.Router();

  iceRouter.entries.forEach(function(entry){

    var path = entry.path;
    var handlerFn  = entry.handler;
    var header = entry.header;

    router.get(path, (function(handler){
      return function(req, res, next){
        var page = new ServerPage(req, res, header);
        // apply these functions to each page
        iceRouter.middleware.forEach(function(fn){
          fn.call(iceRouter, page)
        });
        handler.call(iceRouter, page);
      };
    })(handlerFn));

  }.bind(this));

  // app.use(function(req, res){
  //   var page = new ServerPage(req, res);
  //   page.error(404);
  // });

  return router;

}
