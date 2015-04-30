var util = require('../lib/util.js'),
    serverRouter = require('../lib/serverRouter.js'),
    clientRouter = require('../lib/clientRouter.js');

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
  return new clientRouter(this);
};

Router.prototype.exportServer = function(){
  var router = new serverRouter(this)
  return router.init();
}