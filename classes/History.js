var Backbone = require('backbone'),
    url = require('url'),
    querystring = require('querystring'),
    _ = require('backbone/node_modules/underscore');

module.exports = _.extend(Backbone.history, {

  parseUrl: function(){
    return url.parse(window.location.href);
  },

  getFragment: function(fragment, forcePushState) {
    return this.parseUrl().pathname;
  },

  loadUrl: function(fragment) {
    fragment = this.fragment = this.getFragment(fragment);
    var queryString = this.parseUrl().query;
    var query = querystring.parse(queryString);

    return _.any(this.handlers, function(handler) {
      if (handler.route.test(fragment)) {
        handler.callback(fragment, query);
        return true;
      }
    });
  },

  route: function(route, callback) {
    this.handlers.unshift({route: route, callback: callback});
  }

});


