module.exports = Router = function(){
  this.paths = [];
};

Router.prototype.path = function(route, handler){
  this.paths.push({
    route: route,
    handler: handler
  });
}