var express = require('express'),
    artistData = require('./data.json'),
    bodyParser = require('body-parser'),
    cookie = require('express/node_modules/cookie');

var app = module.exports = express();
app.use(bodyParser.json());

// get all artists
// 
app.get('/artists', function(req, res){
  res.json(artistData.topartists.artist);
});

// get one artist by id, which is a modified version
// of the 'name' property in the json file
// 
app.get('/artists/:id', function(req, res){
  artistData.topartists.artist.forEach(function(artist){
    artistName = artist.name.replace(/\s+/g, '').toLowerCase()
    if(artistName == req.params.id){
      res.json(artist);
    }
  });

  if (!res.headersSent) res.status(404).end();

});

// login route to simulate authentication with cookies
// 
app.post('/login', function(req, res){
  if(req.body.password === 'theword'){
    res.cookie('authtoken', "12345678910")
    res.status(200).end();
  }else{
    res.status(401).end();
  }
});


// Fake artist profile page to correspond to /login route
// 
app.get('/me', function(req, res){
  
  var reqCookies = cookie.parse(req.headers.cookie);
  if(!reqCookies) return res.status(401).end()

  if(reqCookies['authtoken'] === "12345678910"){
    res.json({
      playCount: "100",
      mbid: "fc7376fe",
      name: 'Colton Brown'
    });
  }else{
    res.status(401).end();
  }
});

