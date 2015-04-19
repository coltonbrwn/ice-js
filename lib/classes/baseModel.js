var sd = require('sharify').data,
    Backbone = require('backbone'),
    util = require('../util.js');
    
module.exports = {

  // Should be called from the router.
  // Delegates to fill() or initialFetch() depending on
  // the environment
  populate: function(){
    if(util.isClient()){
      return fill.apply(this, arguments);
    }else{
      return initialFetch.apply(this, arguments);
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
    if (this instanceof Backbone.Collection){
      return Backbone.Collection.prototype.fetch.call(this, options);
    }else if (this instanceof Backbone.Model){
      return Backbone.Model.prototype.fetch.call(this, options);
    }else{
      throw "Model must be an instance of a Backbone Class"
    }
  },

  // Generate a string that can be used to uniquely 
  // identify the model instance. This is used to store
  // bootstrapped data entries on the window object
  getHash: function(requestOptions){    
    return "bsdata:" + util.safeString(this.url());
  },

  // Custom ajax request that behaves like "fetch",
  // emitting proper backbone events throughout the 
  // requires lifecycle
  ajax: function(settings){
    var _complete = settings.complete || function(){};
    var _beforeSend = settings.beforeSend || function(){};
    var model = this;

    settings.complete = function(jqxhr, status){
      if (status === 'success') {
        model.trigger('sync');
      }else{
        model.trigger('error');
      }
      _complete(jqxhr, status);
    }

    settings.beforeSend = function(jqxhr, settings){
      model.trigger('request');
      _beforeSend(jqxhr, settings);
    }

    return Backbone.$.ajax(settings);
  }
}


// Private methods

// Client-only
// 
// Replaces fetch, but first checks to see if the 
// requested data exists on the global sharify object,
// which would have been set by initialFetch 
function fill(options){
  util.requireClient();
  // if fetched data exists in sharify data object,use it
  if( typeof sd.bsdata[this.getHash()] === 'object' ){
    var bootstrappedData = sd.bsdata[this.getHash()];
    var deferred = Backbone.$.Deferred();
    this.set(this.parse(bootstrappedData));
    deferred.resolve(bootstrappedData);
    return deferred.promise();
  // otherwise do the normal fetch, log a warning
  }else{ 
    console.log('warning: tried filling with bootstrap '
      + 'data, none found for key "'+this.getHash()+'"');
    return this.fetch(options);
  }
};

// Server-only
// 
// Replaces fetch, but sets the return value on the 
// global sharify object, so that it will be attached to
// the DOM on pageload
function initialFetch(options){
  util.requireServer();
  sd.bsdata || (sd.bsdata = {});
  return this.fetch(options).then(function(res){
    sd.bsdata[this.getHash()] = res;
  }.bind(this));
};



