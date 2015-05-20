var Ice = require('ice-js'),
    Demo = require('../components/Demo.jsx'),
    Artists = require('../artistsCollection.js'),
    Artist  = require('../artistModel.js'),
    el = require('react').createElement;

var Router = module.exports = new Ice.Router;

// Router.all(function(page){

// );

Router.path('/', function(page){

  page.setHeader(function(props){
    return [
      el('title', null, props.collection.models[0].get('name')),
      el('link', {
        rel:'stylesheet', 
        href:'/ice-assets/style.css'
      })
    ]
  });

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