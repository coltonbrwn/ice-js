var IceRouter = require('./lib/classes/router.js');
var Router = new IceRouter;

Router.path('/', function(page){
  page.render('lol');
});

Router.path('/test', function(page){
  page.render('hi');
});

module.exports = Router;