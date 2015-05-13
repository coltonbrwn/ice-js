var sd = require('sharify').data,
    Backbone = require('backbone'),
    $ = require('jquery'),
    util = require('./util.js');
    
module.exports = {

  // Should be called from the router.
  // Delegates to fill() or initialFetch() depending on
  // the environment
  populate: function(options){
    if(util.isClient()){
      return this._fill(options);
    }else{
      return this._initialFetch(options);
    }
  },

  // Accepts a page object, and looks for a 
  // connect.sid cookie which it will attach to the 
  // instance for use in fetch. chainable...
  authorize: function(page){
    page.authorizeModel(this);
    return this;
  },

  // Performs the normal fetch, but supplies the authCookie
  // set in the authorize function, if it exists
  fetch: function(options){
    options = options || {};
    if (typeof this.authCookie !== 'undefined') {
      options.authToken = this.authCookie;
    }
    if (this.__classType === 'Collection'){
      return Backbone.Collection.prototype.fetch.call(this, options);
    }else if (this.__classType === 'Model'){
      return Backbone.Model.prototype.fetch.call(this, options);
    }else{
      throw "Model must be an instance of a Backbone Class"
    }
  },

  sync: function(){
    if(util.isServer()){
      return require('backbone-super-sync').apply(this, arguments);
    }else{
      return Backbone.sync.apply(this, arguments);
    }
  },

  // Generate a string that can be used to uniquely 
  // identify the model instance. This is used to store
  // bootstrapped data entries on the window object
  getHash: function(requestOptions){   
    var url = typeof this.url === 'function'
      ? this.url()
      : this.url;
    return "bsdata:" + util.safeString(url);
  },

  _fill: function(options){
    util.requireClient();
    // if fetched data exists in sharify data object, use it
    if( typeof sd.bsdata[this.getHash()] === 'object' ){
      var bootstrappedData = sd.bsdata[this.getHash()];
      var deferred = $.Deferred();
      this.set(this.parse(bootstrappedData));
      deferred.resolve(bootstrappedData);
      return deferred.promise();
    // otherwise do the normal fetch, log a warning
    }else{ 
      console.log('warning: tried filling with bootstrap '
        + 'data, none found for key "'+this.getHash()+'"');
      return this.fetch(options);
    }
  },

  _initialFetch: function(options){
    util.requireServer();
    sd.bsdata || (sd.bsdata = {});
    return this.fetch(options).then(function(res){
      sd.bsdata[this.getHash()] = res;
    }.bind(this));
  }
}