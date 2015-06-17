---
layout: main
permalink: /readme.html
---

# Ice.js

[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]

#### What it is

Ice is a small routing framework for making isomorphic MVC applications easy to build in javascript. It allows you to write DRY, modular and declarative code that runs happily on the client or server. 

#### What it isn't

Ice is not a standalone solution for building web applications. It does not support any I/O besides HTTP, and it doesn't support sockets or have an extensive library. It just consumes data from an existing API and renders it into views efficiently and using as little code as possible.

## Using Ice
Define your application by creating an instance of `Ice.Router` and specifying paths and handlers. Here's a router for "Hello World":

```javascript
//router.js
var Ice = require('ice-js'),
    router = new Ice.Router;

router.path('/', function(page){
  page.render('Hello World!');
});

module.exports = router;
```

Then just call `router.make()` and mount the router onto your Express server:

```javascript
//index.js
var app = require('express')(),
    router = require('./router.js');
    
app.use(router.make());
app.listen(3000);
```

That's all you need to create a fully isomorphic javascript application with Ice! Below, you can learn more about the features of Ice and how to use them. Make sure to check out the [full docs][doc-link] and important [caveats](https://github.com/coltonTB/ice-js/blob/master/DOCS.md#caveats) about using Ice.


*Ice is build on top the following open-source technologies:*

[React](https://facebook.github.io/react/) &nbsp;|&nbsp;
[Backbone.js](http://backbonejs.org/) &nbsp;|&nbsp;
[Express.js](http://expressjs.com/) &nbsp;|&nbsp;
[Browserify](http://browserify.org/)

## Ice Class Overview

### Ice.Router
The Ice Router Class is inspired by express, and is composable. Like the express router, it has `use` and `all` functions for attaching other router instances together and create complex routing schemes that are separated into modules. You can also use express-style regexes, globs, and parameters within your route definitions. See the [full documentation](https://github.com/coltonTB/ice-js/blob/master/DOCS.md#router).

```javascript
// router1.js
var Ice = require('ice-js'),
    router = new Ice.Router;

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
var Ice = require('ice-js'),
    router = new Ice.Router;

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
app.use(router.exportServer());
app.listen(3000);
// accepts routes /foo/abXcd, /foo/HELLO, /lower/HELLO
```

### Ice.Page
Each route defined on a router gets a callback with a reference to a `page` object, which holds any `params` defined in routes, a `query` object, and cookies. You generally don't ever create instances of `Ice.Page`, because they are created for you by the router. While the `page` object's `render` function can accept strings, the real power of Ice comes when you supply `render` with React components:

```javascript
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

The `page` object works with the router to present a consistent api for dealing with the routes on either the client or server. The `render` function allows the `Ice.Router` class to serve as a fully-featured router for React. Check out the [full documentation](https://github.com/coltonTB/ice-js/blob/master/DOCS.md#page).

### Ice.Model and Ice.Collection
These classes are extensions of Backbone Models and Collections and behave very much the same way, but with added isomorphic features. Used together with `Ice.Router`, they provide automatic bootstrapping via the function `populate`, which has the same signature as `fetch`. Here's an example that uses an Ice Model to fetch data from an API by ID, then render it asynchronously:

```javascript
// dataModel.js
module.exports = Ice.Model.extend({
  urlRoot: 'http://data-api.com'
});
```

```javascript
// router.js
var DataModel = require('./dataModel.js'),
    router = new Ice.Router();

router.path("/getData/:id", function(page){
  var model = new DataModel({id: page.params.id});
  model.populate().then(function(){
    page.render(model.get('data'));
  });
});

module.exports = router;
```

On the server, `populate` makes a call to `http://data-api.com/[id]` by delegating to Backbone.fetch, then bootstraps the response. On the client, `populate` fills the model with the bootstrapped data without having to make a network request. View the [full documentation](https://github.com/coltonTB/ice-js/blob/master/DOCS.md#model).

## Examples
coming soon...


[doc-link]: http://coltontb.github.io/ice-js/docs.html
[travis-image]: https://travis-ci.org/coltonTB/ice-js.svg?branch=master
[travis-url]: https://travis-ci.org/coltonTB/ice-js
[npm-image]: https://img.shields.io/npm/v/ice-js.svg
[npm-url]: https://npmjs.org/package/ice-js
