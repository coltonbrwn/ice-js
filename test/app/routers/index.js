var IceRouter = require('ice-js').Router,
    Demo = require('../components/demo.jsx'),
    artistsCollection = require('../artistsCollection.js');

var Router = module.exports = new IceRouter;

Router.path('/', function(page){
  page.render('home');
});

Router.path('/react-async', function(page){
  var collection = new artistsCollection
  collection.fetch().then(function(){
    page.render(Demo);
  }).fail(function(e){
    throw e
  }).done();
});

Router.path('/react-sync', function(page){
  page.render(Demo);
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