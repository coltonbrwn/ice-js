var Backbone = require('backbone'),
    ClientPage = require('../Page/clientPage.js'),
    IceHistory = require('../History.js'),
    pathToRegexp = require('path-to-regexp');

module.exports = Backbone.Router.extend({


    initialize: function(iceRouter){
      this.iceRouter = iceRouter;
      var router = this;
      iceRouter.entries.forEach(function(entry, i){
        var pathString = entry.path;
        router.route(pathString, entry.handler);
      });
    },

    route: function(route, callback) {

      var keys = this._keysForPath(route)
      var routeRegexp = this._routeToRegExp(route);
      var router = this;

      IceHistory.route(routeRegexp, function(fragment, query) {
        
        var params = {},
            args = routeRegexp.exec(fragment);

        keys.forEach(function(key, i){
          params[key.name] = args[i+1];
        });

        router.execute(callback, params, query);

      });

      return this;
    },

    execute: function(callback, params, query) {
      var page = new ClientPage(params, query);
      if (callback) callback.call(this.iceRouter, page);
    },

    navigate: function(fragment, options) {
      Ice.History.navigate(fragment, options);
      return this;
    },

    _routeToRegExp: function(route) {
      return pathToRegexp(route);
    },

    _keysForPath: function(route) {
      var keys = [];
      pathToRegexp(route, keys);
      return keys;
    }

  });