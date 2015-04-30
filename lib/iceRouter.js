var Backbone = require('backbone'),
    ClientPage = require('./clientPage.js'),
    iceHistory = require('./iceHistory.js'),
    pathToRegexp = require('path-to-regexp');

module.exports = Backbone.Router.extend({


    initialize: function(iceRouter){
      this.iceRouter = iceRouter;
      var router = this;
      iceRouter.entries.forEach(function(entry, i){
        var pathString = entry.path;
        if (pathString[0] !== '/')
          throw "routes must begin with '/'"
        router.route(pathString, entry.handler);
      });
    },

    route: function(route, callback) {

      if (typeof route !== 'string') throw 'route must be string'

      var keys = this._keysForPath(route)
      var routeRegexp = this._routeToRegExp(route);
      var router = this;

      iceHistory.route(routeRegexp, function(fragment, query) {
        
        var params = {},
            args = routeRegexp.exec(fragment);

        keys.forEach(function(key, i){
          params[key] = args[i];
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
      iceHistory.navigate(fragment, options);
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