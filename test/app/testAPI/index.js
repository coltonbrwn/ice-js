var express = require('express'),
    artistData = require('./data.json');

var app = module.exports = express();

app.get('/data/artists', function(req, res){
  res.json(artistData.topartists.artist)
});

app.get('/data/artists/:id', function(req, res){

  artistData.topartists.artist.forEach(function(artist){
    artistID = artist.name.replace(/\s+/g, '').toLowerCase()
    if(artistID == req.params.id){
      res.json(artist)
    }
  });

  if (!res.headersSent) res.statusCode(404).end();

});