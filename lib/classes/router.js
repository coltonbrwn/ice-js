module.exports = Router = function(){
  this.entries = [];
};

Router.prototype.path = function(path, handler){
  this.entries.push({
    path: path,
    handler: handler
  });
}