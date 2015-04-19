var express = require('express'),
    Page = require('./lib/serverPage.js');

module.exports = {

  Model : require('./lib/model.js'),

  Colletion : require('./lib/collection.js'),

  Router: function(){
    var app = express();
    var router = require(this.routerPath);
    router.paths.forEach(function(path){

      var pathRoute = path.route;
      var pathHandler = path.handler;

      app.get(pathRoute, (function(handler){
        return function(req, res){
          var page = new Page(req, res);
          handler.call(router, page);
        };
      })(pathHandler));

    });

    // need to set up static routes for bundle.js
    // inside node_modules?

  },

  config: function(options){
    this.routerPath = options.router;
  }
}
