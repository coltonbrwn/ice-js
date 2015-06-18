# Ice.js

[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]

#### What it is

Ice is a small framework for making performant single-page javascript applications easier to build with Express.js. It allows you to define routes and handlers and automatically handles data bootstrapping and markup pre-rendering. It's fully [isomorphic](http://isomorphic.net/), which means that once you finish defining routes and behavior, it will execute on both the client and the server. It also supports rendering [React](http://facebook.github.io/react/).

#### What it isn't

Ice is not a standalone solution for building a web application, because it relies on an external API. It does not support any I/O besides HTTP, and it doesn't support sockets or have an extensive library. It just consumes data from the existing API and renders it into views efficiently and using as little code as possible. The focus of Ice is to help you write an application that is naturally isomorphic, leaving server-specific logic to a separate codebase.

#### Why use it?

If you already know Express.js and Backbone, there's very little to learn in order to start building an Ice app. Ice deliberately extends these two popular libraries to provide minimal overhead to getting started. Ice also imposes minimal structure; beyond the route/handler paradigm there is very little stopping you from using Ice to implement exotic architectures of your own. In particular, the `Ice.Router` class is composable and modular in the spirit of Express, encouraging tidy, scalable code.

## Getting Started

You should use NPM to get the latest version of Ice.js and require it into your project (you'll also need [Express](http://expressjs.com/)):

```bash
npm install -S ice-js
```

Then define the structure of your application by creating an instance of `Ice.Router` and specifying path/handler pairs:

```javascript
//router.js
var Ice = require('ice-js'),
    router = new Ice.Router;

router.path('/', function(page){
  page.render('Hello World!');
});

module.exports = router;
```

In a separate file, require the router you created above and call `router.make()` to mount it onto an existing Express server:

```javascript
//index.js
var express = require('express'),
    router = require('./router.js');
    
var app = express();

app.use(router.make());
app.listen(3000);
```

You now have a minimal but complete Ice.js application. The above code creates a server that renders the string "Hello World!" in response to requests for the `/` route. In addition, visiting `/` will instantiate a client-side application that reproduces the exact same behavior, rendering "Hello World!" when the browser's url is at the root location. 

Using Ice it's trivial to build applications that automaticaly 'pre-render' server-side and then run as client-side apps once the page is loaded in the browser. Below is an overview of features of Ice and how to use them. You should also check out the [full docs][doc-link], specifically important [caveats]({{page.doc_link}}#caveats) about using Ice, and [how it works]({{page.doc_link}}#how). Enjoy!

Ice is built on top the following open-source technologies:

[React](https://facebook.github.io/react/) &nbsp;|&nbsp;
[Backbone.js](http://backbonejs.org/) &nbsp;|&nbsp;
[Express.js](http://expressjs.com/) &nbsp;|&nbsp;
[Browserify](http://browserify.org/)

## Ice Class Overview

### Ice.Router
The Ice Router Class is inspired by the Express router class. Like it's cousin, it has `use` and `all` functions for attaching other router instances together and create complex routing schemes that are separated into modules. You can also use express-style regexes, globs, and parameters within your route definitions. See the [full documentation]({{page.doc_link}}#router) for more details.

Here's an example of a number of these features implemented:

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
Each route defined on a router gets a callback with a reference to a `page` object, which holds any `params` defined in routes, a `query` object, and cookies. While the `page` object's `render` function can accept strings as shown in the 'getting started' example, you can also supply a React component and dynamic data:

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

The `page` object works with the router to present a consistent api for dealing with the routes on either the client or server. The `render` function allows the `Ice.Router` class to serve as a fully-featured router for React. Check out the [full documentation]({{page.doc_link}}#page).

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

On the server, `populate` makes a call to `http://data-api.com/[id]` by delegating to Backbone.fetch, then bootstraps the response. On the client, `populate` fills the model with the bootstrapped data without having to make a network request. View the [full documentation]({{page.doc_link}}#model).

## Examples
coming soon...


[doc-link]: {{page.doc_link}}
[travis-image]: https://travis-ci.org/coltonTB/ice-js.svg?branch=master
[travis-url]: https://travis-ci.org/coltonTB/ice-js
[npm-image]: https://img.shields.io/npm/v/ice-js.svg
[npm-url]: https://npmjs.org/package/ice-js
