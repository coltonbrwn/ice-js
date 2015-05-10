var Ice = require('ice-js');

var Router = new Ice.Router();

Router.path('/testlol', function(page){
  page.render('LOLOL');
});

module.exports = Router;