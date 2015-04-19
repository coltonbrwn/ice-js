var React = require('react'),
    Index = require('./htmlBoilerplate.jsx'),
    Error = require('./error.jsx'),
    util  = require('./util.js');

var Page = module.exports = function(_req, _res){
  this._req = _req;
  this._res = _res;
  this.params = _req.params;
  this._metadata = [];
};

Page.prototype.render = function(Component, initialProps){
  var sd = require('sharify').data;
  var element = React.createElement(Component, initialProps);
  var contentString = React.renderToString(element);
  var html = React.renderToStaticMarkup(
    React.createElement(Index, {
      sd: sd,
      content: contentString,
      metadata: this._metadata
    })
  );
  this._res.send(html);
};


Page.prototype.authorizeModel = function(model){
  model.authCookie = this._req.cookies['connect.sid'];
  return model;
}

Page.prototype.meta = function(metadata){
  util.arrayMerge(this._metadata, metadata);
  return this;
}

Page.prototype.error = function(status){
  status = (typeof status === 'number') ? status : 500;
  var sd = require('sharify').data;
  sd.bsdata = {};
  var element = React.createElement(Error, {errorCode:status});
  var contentString = React.renderToString(element);
  var html = React.renderToStaticMarkup(
    React.createElement(Index, {
      sd: sd,
      content: contentString,
      metadata: this._metadata
    })
  );
  this._res.status(status).send(html)
}

Page.prototype.visit = function(urlFragment){
  this._res.redirect(urlFragment); 
}