var React = require('react'),
    Index = require('../../components/htmlBoilerplate.jsx'),
    Error = require('../../components/error.jsx'),
    DefaultHead = require('../../components/htmlHeader.jsx'),
    util  = require('../../lib/util.js'),
    cookie = require('express/node_modules/cookie');


var Page = module.exports = function(_req, _res, header){
  this._req = _req;
  this._res = _res;
  this.params = _req.params || {};
  this.query = _req.query || {};
  this.header = header || undefined;
};

Page.prototype.render = function(Component, initialProps){
  var sd = require('sharify').data;

  if (typeof Component === 'function') {
    var element = React.createElement(Component, initialProps);
    var contentString = React.renderToString(element);
  }else if(typeof Component === 'string'){
    var contentString = Component;
  }

  var headerContent = this.header
      ? this.header.render(initialProps)
      : '';

  var html = React.renderToStaticMarkup(
    React.createElement(Index, {
      sd: sd,
      content: contentString,
      header: headerContent
    })
  );

  this._res.send(html);
};


Page.prototype.getCookies = function(options){
  options = options || {};
  var str = this._req.headers.cookie || '';
  return options.parse ? cookie.parse(str) : str;
};

Page.prototype.setCookie = function(name, value, options){
  return this._res.cookie.apply(null, arguments);
};

Page.prototype.error = function(status){
  status = (typeof status === 'number') ? status : 500;
  var sd = require('sharify').data;
  sd.bsdata = {};
  var element = React.createElement(Error, {errorCode:status});
  var contentString = React.renderToString(element);
  var html = React.renderToStaticMarkup(
    React.createElement(Index, {
      sd: sd,
      content: contentString
    })
  );
  this._res.status(status).send(html)
}

Page.prototype.visit = function(urlFragment){
  this._res.redirect(urlFragment); 
}