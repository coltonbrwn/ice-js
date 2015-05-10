var Ice = require('ice-js'),
    Product  = require('./productModel.js');

var Router = new Ice.Router;

Router.path('/', function(page){
  page.render('home');
});

Router.path('/product/:id', function(page){
  var productId = page.params.id;
  var product = new Product({id:productId});

  product.populate()
    .then(function(){
      page.render(product.get('title'));
    }).fail(function(e){
      throw e;
      page.error(404);
    });

});

var otherRouter = require('./otherRouter.js');

Router.use(otherRouter);

module.exports = Router;