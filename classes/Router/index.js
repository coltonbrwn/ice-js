var util = require('../../lib/util.js'),
    serverRouter = require('./serverRouter.js'),
    clientRouter = require('./clientRouter.js'),
    stack = require('callsite');

module.exports = Router = function(){
  this.entries = [];
  this.location = stack()[1].getFileName();
};

Router.prototype.path = function(path, handler){

  if (typeof handler !== 'function')
    throw 'handler must be a function';

  if (typeof path === 'string' && path[0] !== '/')
    path = '/'+path;

  this.entries.push({
    path: path,
    handler: handler
  });
};

Router.prototype.use = function(router){
  if (router instanceof Router){
    util.arrayMerge(this.entries, router.entries);
  }
  return this
};

Router.prototype.exportClient = function(){
  global.ICE_ENV = 'client'
  return new clientRouter(this);
};

Router.prototype.exportServer = function(){
  global.ICE_ENV = 'server'
  return serverRouter(this);
}

Router.prototype.getLocation = function(){
  return this.location;
}