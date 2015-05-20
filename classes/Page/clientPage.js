var React = require('react'),
    Error = require('../../components/error.jsx'),
    cookie = require('express/node_modules/cookie');

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

  // notifies anyone listening that the page has rendered
  if(window.onPageDone) window.onPageDone()
};


Page.prototype.getCookies = function(options){
  options = options || {};
  var str = document.cookie || '';
  return options.parse ? cookie.parse(str) : str;
};

Page.prototype.setCookie = function(name, value, options){
  var cookieString = cookie.serialize.apply(null, arguments);
  return document.cookie = cookieString;
};

Page.prototype.error = function(status){
  React.render(React.createElement(Error, {errorCode:status}),
    document.getElementById('app'));
};

Page.prototype.visit = function(urlFragment){
  Backbone.history.navigate(urlFragment,{trigger:true});
}

Page.prototype.setHeader = function(headerFn){
  return this;
};