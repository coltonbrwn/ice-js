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
  page.render(page.params.first+page.params.last);
});

Router.path('/query', function(page){
  var string = 'his name is '
    + page.query.first
    + ' '
    + page.query.last;
  page.render(string);
});

Router.path('/queryMath', function(page){
  var q = page.query;
  page.render(q.a+q.b+q.c+q.d);
})

Router.use(require('./auxRouter.js'));