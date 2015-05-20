var React = require('react'),
    Index = require('../../components/htmlBoilerplate.jsx'),
    util  = require('../../lib/util.js'),
    cookie = require('express/node_modules/cookie');


var Page = module.exports = function(_req, _res){
  this._req = _req;
  this._res = _res;
  this.params = _req.params || {};
  this.query = _req.query || {};
  this.headerDefs = [];
};

Page.prototype.render = function(Component, initialProps){
  var sd = require('sharify').data;

  if (typeof Component === 'function') {
    var element = React.createElement(Component, initialProps);
    var contentString = React.renderToString(element);
  }else if(typeof Component === 'string'){
    var contentString = Component;
  }

  var headerContent = getHeaderContent(this.headerDefs, initialProps);

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

Page.prototype.visit = function(urlFragment){
  this._res.redirect(urlFragment); 
}

Page.prototype.setHeader = function(headerFn){
  if (typeof headerFn === 'function') {
    this.headerDefs.push(headerFn);
  }else{
    throw new Error('argument must be a function that returns (an array of) React Elements')
  }
}

// Returns an array of React Elements, with unique keys,
// that serve as the result of the collection of all
// header definition functions registerd with the page
// 
function getHeaderContent(headerDefs, initialProps){
  var mergedHeaderDefs = [], i=0;

  headerDefs.forEach(function(def){
    var elements = def(initialProps);
    // allows def function to return just a single element
    if (typeof elements[0] === 'string') {
      mergedHeaderDefs.push(elements);
    }else{
      Array.prototype.push
        .apply(mergedHeaderDefs, elements);
    }
  });

  return mergedHeaderDefs.map(function(def){
    var props = def[1] || {};
    props.key = i; i++;
    def[1] = props;
    return React.createElement.apply(null, def);
  })
}