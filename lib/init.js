var router = require('../router.js'),
    ServerPage   = require('./page.js').server,
    ClientPage   = require('./page.js').server;

module.exports.server = function(app){

  for(path in router.routes){
    var handlerName = router.routes[path];
    var handler = router[handlerName]

    if (path.charAt(0) !== '/') throw "improper route"

    app.get(path, (function(handler){
      return function(req, res){
        var page = new ServerPage(req, res);
        handler.call(router, page);
      };
    })(handler));
  }

  app.use(function(req, res){
    var page = new ServerPage(req, res);
    page.error(404);
  });
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
