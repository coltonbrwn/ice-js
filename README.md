#Ice.js

####What it is
Ice is a small group of tools for making isomorphic MVC applications easy to build in javascript. It runs server-side on top of Express, and supports React for UI rendering. It allows you to write DRY, modular code using familiar APIs that run anywhere.

####What it isn't
Ice is not comprehensive framework and, since it aims to be Isomorphic, its features are limited to the things you can do within a browser. Therefore it has no methods for performing database access, shell commands, or anything I/O besides http. It just consumes data and renders it into views efficiently with Isomorphic techniques using as little code as possible.

##Using Ice
Define your application by creating an instance of `Ice.Router` and specifying paths and handlers. Here's a router for "Hello World":
```javascript
//router.js
var Ice = require('ice-js');
var router = module.exports = new Ice.Router;

router.path('/', function(page){
  page.render('Hello World!');
});
```
To run this on the server, call the router's `make` function and mount it onto an express app with `use`:
```javascript
//index.js
var app = require('express')(),
    router = require('./router.js');
    
app.use(router.make());
app.listen(3000);
```
To run on the client, you'll need to serve a bundled version of the router at `/ice-assets/bundle.js`, which Ice will automatically fetch and instantiate on pageload. Pass the router instance to `Ice.build`, and you'll get back the bundle file in the form of a [readable stream](https://nodejs.org/api/stream.html#stream_class_stream_readable) that you can write to disk then serve statically:
```javascript
var Ice = require('ice-js'),
    router = require('./router.js'),
    fs = require('fs');
    
Ice.build(router)
  .pipe(fs.createWriteStream(__dirname+'/bundle.js'));

app.use('/ice-assets', express.static('./build'));
```
Together, the client and server components support an application that listens to the specified routes and pre-renders their responses on the server. Once the page loads, it executes `bundle.js` and re-renders the page client-side with javascript. The above is all the setup you'll need to do, the rest of this guide shows you how to take advantage of Ice classes.

###Ice.Router
The Ice Router Class is inspired by express, and is composable. Like the express router, it has `use` and `all` functions for attaching other router instances together and create complex routing schemes that are separated into modules. You can also use express-style regexes, globs, and parameters within your route definitions. See the [full documentation]().
```javascript
// router1.js
var router = exports = new require('ice-js').Router;

router.path('/ab*cd', function(page){
  page.render('OK');
});
router.path(/[A-Z]+/, function(page){
  page.render('OK');
});

module.exports = router;
```
```javascript
// router2.js
var router  = new require('ice-js').Router;

router.path('/lower/:string', function(page){
  page.render(page.params.string.toLowerCase());
});

// mount router1 at /foo
router.use('/foo', require('./router1.js'));

module.exports = router;
```
```javascript
// index.js
var router = require('./router2.js');
app.use(router.make());
app.listen(3000);
// accepts routes /foo/abXcd, /foo/HELLO, /lower/HELLO
```

###Ice.Page
Each route defined on a router gets a callback with a reference to a `page` object, which holds any `params` defined in routes, a `query` object, and cookies. You generally don't ever create instances of `Ice.Page`, because they are created for you by the router. While the `page` object's `render` function can accept strings, the real power of Ice comes when you supply `render` with React components:

```
var Greeting = React.createClass({
  render: function(){
    return <div>
      Hello {this.props.name} !
    </div>
  }
});

router = new Ice.Router();
router.path('/greet/:name', function(page){
  page.render(Greeting, {
    name: page.params.name
  });
});

express().use(router).listen(3000);

```
```GET localhost:3000/greet/tom   -->  <div>Hello tom !</div>```

The `page` object works with the router to present a consistent api for dealing with the routes on either the client or server. The `render` function allows the `Ice.Router` class to serve as a fully-featured router for React. Check out the [full documentation]().

###Ice.Model and Ice.Collection
These classes are extensions of Backbone Models and Collections and behave very much the same way, but with added isomorphic features. Used together with `Ice.Router`, they provide automatic bootstrapping via the function `populate`, which has the same signature as `fetch`. Here's an example that uses an Ice Model to fetch data from an API by ID, then render it asynchronously:

```javascript
// dataModel.js
module.exports = Ice.Model.extend({
  urlRoot: 'http://data-api.com'
});
```
```javascript
// router.js
var DataModel = require('./dataModel.js')
var router = new Ice.Router();

router.path("/getData/:id", function(page){
  var model = new DataModel({id: page.params.id});
  model.populate().then(function(){
    page.render(model.get('data'));
  });
});

module.exports = router;
```
On the server, `populate` makes a call to `http://data-api.com/[id]` by delegating to Backbone.fetch, then bootstraps the response. On the client, `populate` fills the model with the bootstrapped data without having to make a network request. View the [full documentation]().

##Examples
coming soon...