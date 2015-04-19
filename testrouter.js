var Ice = require('./ice.js');
var Router = new Ice.Router;

Router.path('/', function(page){
  page.render('lol');
});

Router.path('/test', function(page){
  page.render('hi');
});

module.exports = Router;