var Ice = require('ice-js'),
    Demo = require('../components/Demo.jsx'),
    Artists = require('../artistsCollection.js');

var Router = module.exports = new Ice.Router;

Router.path('/', function(page){
  var artistsCollection = new Artists
  artistsCollection.populate().then(function(){
    page.render(Demo, {
      collection: artistsCollection
    });
  }).done();
});