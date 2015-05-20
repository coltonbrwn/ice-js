#Ice.js

####What it is
Ice is a small group of tools and APIs for making isomorphic javascript applications easy to build.
It runs server-side on top of Express, and supports React for UI rendering.
It allows you to write DRY, modular code using familiar APIs that can run anywhere.

####What it isn't
Ice is not to be used as a data source, it has no methods for database access, shell commands, or anything I/O besides http.
It relies on the existence of a data source in the form of a REST API.
It's not for building web applications that don't map HTTP routes to behavior.

##Using Ice
Define your application by creating an instance of `Ice.Router` and specifing a path with a handler:
`//router.js`
```javascript
var Ice = require('ice-js');
var Router = module.exports = new Ice.Router;
router.path('/', function(page){
  page.render('Hello World!');
});
```
To run on the server, call the router's `make` function and mount it onto express with `use`:
`//index.js`
```javascript
var express = require('express'),
    app = express(),
    router = require('./router.js');
app.use(router.make());
app.listen(3000);
```
To run on the client, you'll need to create a `bundle.js` file.
Pass the router instance to `Ice.build`, and you'll get a [Readable Stream](https://nodejs.org/api/stream.html#stream_class_stream_readable) that you can write to disk then serve statically.
```javascript
var Ice = require('ice-js'),
    router = require('./router.js'),
    fs = require('fs');
    
Ice.build(router)
  .pipe(fs.createWriteStream(__dirname+'/bundle.js'));
```
```javascript
//server.js
app.use('/ice-assets', express.static('./build'));
```

For dev environments, you could also compile the bundle on-demand like this:
```javascript
//server.js
app.get('/ice-assets/bundle.js', function(req, res){
    Ice.build(router).pipe(res);
});
```

###The Ice Router Class
The Ice Router is inspired by express, and is highly composable. You can take advantage of the `use` function to create complex routing schemes that are separated into modules. You can use express-style regexes, globs, and properties to define dynamic routes.
```javascript
//router1.js
var router = exports = new require('ice-js').Router;
router.path('/ab*cd', function(page){
  page.render('OK');
});
module.exports = router;
```
```javascript
//router2.js
var router  = new require('ice-js').Router;
router.path('/tolowercase/:string', function(page){
  page.render(page.params.string.toLowerCase());
});
router.use(require('router1.js'));
module.exports = router;
```
```javascript
//index.js
var router = require('router2.js');
app.use(router.make());
app.listen(3000);
// accepts routes /abcd, /abRANDOMcd, /tolowercase/HELLO
```
