var IceRouter = require('ice-js').Router,
    Product  = require('../productModel.js');

var Router = module.exports = new IceRouter;

Router.path('/', function(page){
  page.render('home');
});

Router.path('/ab*cd', function(page) {
  page.render('ok');
});

Router.path(/[xyz]*fly$/, function(page) {
  page.render('ok');
});

Router.path('/concat/:first/:second', function(page){
  page.render(page.params.first+page.params.second);
});

Router.path('/concat2/:first/:optional?/:last', function(page){
  console.log(page.params)
  page.render(page.params.first+page.params.last);
});

Router.use(require('./auxRouter.js'));