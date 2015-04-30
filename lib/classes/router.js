var util = require('../util.js'),
    serverRouter = require('../serverRouter.js'),
    iceRouter = require('../iceRouter.js');

module.exports = Router = function(){
  this.entries = [];
};

Router.prototype.path = function(path, handler){
  this.entries.push({
    path: path,
    handler: handler
  });
};

Router.prototype.export = function(){
  if (util.isClient()) {
    return this.exportClient();
  }else if(util.isServer()){
    return this.exportServer();
  }
};

Router.prototype.exportClient = function(){
  return new iceRouter(this);
};

Router.prototype.exportServer = function(){
  var router = new serverRouter(this)
  return router.init();
}