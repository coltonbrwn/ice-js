var Ice = require('ice-js');

var Router = new Ice.Router();

Router.path('/aux', function(page){
  page.render('aux-ok');
});

module.exports = Router;