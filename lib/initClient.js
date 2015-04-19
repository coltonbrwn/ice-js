var Backbone = require('backbone'),
    ClientPage = require('./clientPage.js'),
    $ = require('jquery'),
    sd = require('sharify').data;

module.exports = function(){

  var router = require(this.config.routerPath);

  Backbone.$ = $;

  $.ajaxSetup({
    xhrFields: {
      withCredentials: true
    }
  });

  var newRouter = {
    routes : {}
  };

  router.paths.forEach(function(path, i){

    var handlerName = i.toString();
    var pathHandler = path.handler;
    var pathRoute   = path.route;

    if (pathRoute.charAt(0) !== '/') throw "improper route"

    // get a list of parameters
    var paramsList = pathRoute.split('/').filter(function(substr){
      return substr && substr.charAt(0) === ':';
    }).map(function(substr){
      return substr.replace(/:/g, '');
    });

    newRouter.routes[pathRoute.substring(1) + '/'] = handlerName;
    newRouter.routes[pathRoute.substring(1)] = handlerName;

    newRouter[handlerName] = (function(handler, paramsList){
      return function(){
        var page = new ClientPage(arguments, paramsList);
        handler.call(router, page);
      };
    })(pathHandler, paramsList);

  });

  $(function(){
    var Router = Backbone.Router.extend(newRouter);
    window.r = new Router;
    Backbone.history.start({pushState:true});
  });

}
