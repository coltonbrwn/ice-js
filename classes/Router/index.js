var util = require('../../lib/util.js'),
    serverRouter = require('./serverRouter.js'),
    clientRouter = require('./clientRouter.js'),
    stack = require('callsite');

module.exports = Router = function(){
  this.entries = [];
  this.location = stack()[1].getFileName();
  this.middleware = [];
};

Router.prototype.path = function(path, handler){

  if (typeof handler !== 'function')
    throw 'handler must be a function';

  if (typeof path === 'string' && path[0] !== '/')
    path = '/'+path;

  this.entries.push({
    path: path,
    handler: handler,
  });
};

Router.prototype.use = function(mountPoint, router){
  if (typeof router === 'undefined'
      && typeof mountPoint === 'object'){
        router = mountPoint;
        mountPoint = '/';
  }
  if (! router instanceof Router){
    throw new Error('attempted to attach non Ice Router instance');
  }

  // Process individual entries of the target router
  // so that they can be added to this router.
  // If a mount point was specified, prepend it to the path
  router.entries.forEach(function(entry){
    if (mountPoint !== '/' ){
      entry.path = mountPoint + entry.path;
    }
  });

  util.arrayMerge(this.entries, router.entries);
  util.arrayMerge(this.middleware, router.middleware);

  return this
};

Router.prototype.all = function(handler){
  this.middleware.push(handler);
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