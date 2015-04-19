var Router = require('ice-js/Router'),
    Backbone = require('backbone'),
    Product  = require('./productModel'),
    Q      = require('q');

Router.path('/', function(page){
  page.render('home');
});

Router.path('/product/:id', function(page){
  var productId = page.params.id;
  var product = new Product({id:productId});

  Q.allSettled([
    product.populate()
  ]).then(function(){
    page.render(product.get('title'));
  }).fail(function(e){
    throw e;
    page.error(404);
  });

});

module.exports = Router;