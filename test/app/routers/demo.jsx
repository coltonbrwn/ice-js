var Ice = require('ice-js'),
    Demo = require('../components/Demo.jsx'),
    Artists = require('../artistsCollection.js'),
    React = require('react');

var Router = module.exports = new Ice.Router;

Router.setHeader(Ice.createHeader(function(props){
  return [
    <title>{props.collection.models[0].get('name')}</title>,
    <link rel="stylesheet" href="/ice-assets/style.css"/>
  ]
}));

Router.path('/', function(page){
  var artistsCollection = new Artists
  artistsCollection.populate().then(function(){
    page.render(Demo, {
      collection: artistsCollection
    });
  }).done();
});