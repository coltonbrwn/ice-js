var Ice = require('ice-js'),
    Demo = require('../components/Demo.jsx'),
    Artists = require('../artistsCollection.js'),
    Artist  = require('../artistModel.js'),
    React = require('react');

var Router = module.exports = new Ice.Router;

// Router.setHeader(Ice.createHeader(function(props){
//   return [
//     <title>{props.collection.models[0].get('name')}</title>,
//     <link rel="stylesheet" href="/ice-assets/style.css"/>
//   ]
// }));

Router.path('/', function(page){
  var artistsCollection = new Artists
  artistsCollection.populate().then(function(){
    page.render(Demo, {
      collection: artistsCollection
    });
  }).done();
});


Router.path('/profile', function(page){
  Ice.Model.prototype.request({
    url: 'http://localhost:3000/data/me',
    method: 'GET',
    forwardCookies: page.getCookies()
  }).end(function(err, res){
    if (err) return page.render('unauthorized')
    page.render('HELLO '+res.body.name);
  });
});