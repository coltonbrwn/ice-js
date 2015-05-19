var util = require('../../lib/util.js'),
    serverRouter = require('./serverRouter.js'),
    clientRouter = require('./clientRouter.js'),
    stack = require('callsite');

module.exports = Router = function(){
  this.entries = [];
  this.location = stack()[1].getFileName();
  this.headerComponent = null;
};

Router.prototype.path = function(path, handler){

  if (typeof handler !== 'function')
    throw 'handler must be a function';

  if (typeof path === 'string' && path[0] !== '/')
    path = '/'+path;

  this.entries.push({
    path: path,
    handler: handler,
    header: this.headerComponent
  });
};

Router.prototype.use = function(mountPoint, router){
  if (typeof router === 'undefined' && typeof mountPoint === 'object'){
    router = mountPoint;
    mountPoint = '/';
  }
  if (!router instanceof Router){
    throw new Error('attempted to attach non Ice Router instance');
  }

  // process individual entries of the target router
  // if a mount point was specified, prepend it to the route path
  // if the entry does not have a defined header, use this one
  router.entries.forEach(function(entry){
    if (mountPoint !== '/' ) entry.path = mountPoint + entry.path;
    if(!entry.header) entry.header = this.headerComponent;
  });

  util.arrayMerge(this.entries, router.entries);

  return this
};

Router.prototype.setHeader = function(HeadComponent){
  if (typeof HeadComponent !== 'object') {
    throw new Error('invalid Header component');
  };

  // update all entries with new header
  this.headerComponent = HeadComponent;
  this.entries.forEach(function(entry){
    entry.header = HeadComponent;
  });

  return this;
};

Router.prototype.exportClient = function(){
  global.ICE_ENV = 'client'
  return new clientRouter(this);
};

Router.prototype.make = 
Router.prototype.exportServer = function(){
  global.ICE_ENV = 'server'
  return serverRouter(this);
}

Router.prototype.getLocation = function(){
  return this.location;
}