var Ice = require('ice-js');

var Router = module.exports = new Ice.Router();

Router.path('/aux2', function(page){
  page.render('aux2-ok');
});