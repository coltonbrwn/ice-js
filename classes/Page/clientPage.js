var React = require('react'),
    Error = require('../../components/error.jsx');

var Page = module.exports = function(params, query){
  this.params = params || {};
  this.query = query || {};
  this._req = this._res = {};
  this.header = undefined;
};

Page.prototype.render = function(Component, initialProps){
  if (typeof Component === 'function'){
    React.render(React.createElement(Component, initialProps), 
      document.getElementById('app'));
  }else if(typeof Component === 'string'){
    document.getElementById('app').innerHTML = Component;
  }

  if(window.onPageDone) window.onPageDone()
};


Page.prototype.authorizeModel = function(model){
  // no auth needed on client, handled by cookies
  return model;
};

Page.prototype.error = function(status){
  React.render(React.createElement(Error, {errorCode:status}),
    document.getElementById('app'));
};

Page.prototype.visit = function(urlFragment){
  Backbone.history.navigate(urlFragment,{trigger:true});
}