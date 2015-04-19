var ServerPage = require('./serverPage.js'),
    ClientPage = require('./clientPage.js').server,
    express = require('express');

module.exports.server = function(){

  var app = express();
  var router = require(this.routerPath);
  router.paths.forEach(function(path){

    var pathRoute = path.route;
    var pathHandler = path.handler;

    app.get(pathRoute, (function(handler){
      return function(req, res, next){
        var page = new ServerPage(req, res);
        handler.call(router, page);
      };
    })(pathHandler));

  });

  // need to set up static routes for bundle.js
  // inside node_modules?

  // app.use(function(req, res){
  //   var page = new ServerPage(req, res);
  //   page.error(404);
  // });

  return app;
}


module.exports.client = function(){
  var Backbone = require('backbone'),
      $ = require('jquery'),
      Q = require('q'),
      sd = require('sharify').data,
      AuthModel = require('../models/auth.js');

  Backbone.$ = $;

  $.ajaxSetup({
    xhrFields: {
      withCredentials: true
    }
  });

  var newRouter = {
    routes : {}
  };
  for(path in router.routes){
    var handlerName = router.routes[path];
    var handler = router[handlerName];

    if (path.charAt(0) !== '/') throw "improper route"

    // get a list of parameters
    var paramsList = path.split('/').filter(function(substr){
      return substr && substr.charAt(0) === ':';
    }).map(function(substr){
      return substr.replace(/:/g, '');
    });

    newRouter.routes[path.substring(1) + '/'] = handlerName;
    newRouter.routes[path.substring(1)] = handlerName;

    newRouter[handlerName] = (function(handler, paramsList){
      return function(){
        var page = new ClientPage(arguments, paramsList);
        handler.call(router, page);
      };
    })(handler, paramsList);

  }
  var Router = Backbone.Router.extend(newRouter);
  window.r = new Router;
  Backbone.history.start({pushState:true});
}
