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
First create an instance of `Ice.Router` and define a path:
```javascript
//router.js
var Ice = require('ice-js');
var Router = module.exports = new Ice.Router;
router.path('/', function(page){
  page.render('Hello World!');
});
```
To run this router on the server, call its `make` function to return an express router that can be mounted with `use`:
```javascript
//index.js
var express = require('express'),
    app = express(),
    router = require('./router.js');
app.use(router.make());
app.listen(3000);
```
To run it on the client, you'll need to turn the router into a bundled script and run in in a browser context.
By passsing the router instance to `Ice.build`, you'll get a [Readable Stream](https://nodejs.org/api/stream.html#stream_class_stream_readable) that you can write to disk then serve statically.

```javascript
//gulpfile.js
var gulp = require( 'gulp' ),
    Ice = require('ice-js'),
    source = require('vinyl-source-stream'),
    router = require('./router.js');
    
gulp.task( 'default', function(){
  Ice.build(router)
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./build'));
});
```
```javascript
//server.js
app.use('/ice-assets', express.static('./build'));
```

Because Ice.build implements a Readable Stream, you could also serve the bundle on-demand like this:
```javascript
//server.js
app.get('/ice-assets/bundle.js', function(req, res){
    Ice.build(router).pipe(res);
});
```
