var React = require('react'),
    Index = require('./htmlBoilerplate.jsx'),
    Error = require('./error.jsx'),
    sd    = require('sharify').data;

var Page = module.exports = function(args, params){

  this.params = {};
  for(var i=0; i < params.length; i++ ){
    if (args[i]) this.params[params[i]] = args[i];
  }
  
};

Page.prototype.render = function(Component, initialProps){
  if (typeof Component === 'function'){
    React.render(React.createElement(Component, initialProps), 
      document.getElementById('app'));
  }else if(typeof Component === 'string'){
    document.getElementById('app').innerHTML = Component;
  }
};


Page.prototype.authorizeModel = function(model){
  // no auth needed on client, handled by cookies
  return model;
};

Page.prototype.meta = function(){
  // no page meta manipulation on client
  return this;
};

Page.prototype.title = function(){
  // no page meta manipulation on client
  return this;
};

Page.prototype.error = function(status){
  React.render(React.createElement(Error, {errorCode:status}),
    document.getElementById('app'));
};

Page.prototype.visit = function(urlFragment){
  Backbone.history.navigate(urlFragment,{trigger:true});
}