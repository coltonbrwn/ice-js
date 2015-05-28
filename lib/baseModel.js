var sd = require('sharify').data,
    Backbone = require('backbone'),
    util = require('./util.js'),
    supersync = require('backbone-super-sync'),
    request = require('backbone-super-sync/node_modules/superagent'),
    Q = require('backbone-super-sync/node_modules/q');

module.exports = {

  // Should be called from the router.
  // Delegates to fill() or initialFetch() depending on
  // the environment
  // 
  populate: function(options){
    if(util.isClient()){
      return this._fill(options);
    }else{
      return this._initialFetch(options);
    }
  },

  // use backbone-super-sync, built on superagent
  // 
  sync: function(method, model, opts){
    opts = opts || {};
    if (util.isServer() && (typeof opts.forwardCookies === 'string')){
      opts.headers['Cookie'] = opts.forwardCookies;
    }
    return supersync.apply(this, arguments);
  },

  request: function(opts){
    opts = opts || {};
    if (!opts.url) throw new Error('must supply a url');
    if (!opts.method) opts.method = 'GET'
    var method = opts.method.toLowerCase();

    var req = request[method](opts.url);
    if (opts.data) req.send(opts.data)
    if (util.isServer() && (typeof opts.forwardCookies === 'string')) {
      req.set('Cookie', opts.forwardCookies)
    }
    return req;
  }, 

  // Generate a string that can be used to uniquely 
  // identify the model instance. This is used to store
  // bootstrapped data entries on the sharify object
  // 
  getHash: function(requestOptions){   
    var url = typeof this.url === 'function'
      ? this.url()
      : this.url;
    return "bsdata:" + util.safeString(url);
  },

  // Client-only - looks for existing bootsrapped data
  // while exposing the same API as backbone's fetch.
  // Will delegate to regular fetch() on failure
  // 
  _fill: function(options){
    util.requireClient();
    // if fetched data exists in sharify data object, use it
    if( typeof sd.bsdata[this.getHash(options)] === 'object' ){
      var bootstrappedData = sd.bsdata[this.getHash(options)];
      this.set(this.parse(bootstrappedData));
      var deferred = Q.defer()
      deferred.resolve(bootstrappedData)
      return deferred.promise;
    // otherwise do the normal fetch, log a warning
    }else{ 
      console.log('warning: tried filling with bootstrap '
        + 'data, none found for key "'+this.getHash(options)+'"');
      return this.fetch(options);
    }
  },

  // Server-only - performs a fetch and saves the return
  // value to sharify so that it can be picked up as
  // bootstrapped data by the _fill method (above)
  // 
  _initialFetch: function(options){
    util.requireServer();
    sd.bsdata || (sd.bsdata = {});
    return this.fetch(options).then(function(res){
      sd.bsdata[this.getHash(options)] = res;
    }.bind(this));
  }
}