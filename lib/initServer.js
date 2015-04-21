var ServerPage = require('./serverPage.js'),
    express = require('express'),
    Backbone = require('backbone');

module.exports = function(){

  // Override Backbone to use server-side sync
  Backbone.sync = require('backbone-super-sync');

  var app = express();
  var router = require(this.config.routerPath);

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

  app.use('/ice-assets', express.static(this.config.buildDir));

  return app;
}