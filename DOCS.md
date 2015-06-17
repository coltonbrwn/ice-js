# Ice.js Full Documentation

#### Contents
1. [Ice.Router](#router)
1. [Page](#page)
1. [Ice.Model](#model)
1. [Ice.Collection](#collection)
1. [Ice.build](#iceBuild)
1. [Ice.data](#iceData)
1. [How it works](#how)
1. [Ice.js caveats](#caveats)

## 1. <span id="router">Ice.Router</span>

### Router.path

Define a rule for associating a url with a function handler

`router.path(path, handler)`

**path:** A string or Regular Expression that will match against the url

**handler:** A function with the signature `function(page)` that will be executed when the corresponding path is matched. See the [page](#page) docs.

Ice uses the same engine as Express.js to parse **path**, which means you can specifiy `:parameters` whose values will show up in `page.params`, and any of the other routing features found in [express](http://expressjs.com/guide/routing.html)


### Router.use

Merge an external router instance onto this one, absorbing all of the route definitions and their handlers.

`router.use([mountPoint,] router)`

**mountPoint:** (optional) A string to be prepended to each of the entries of **router**

**router:** A router instance to be attached to the given router at **mountPoint**


### Router.all

Apply a function to every path, including those added with `use`

`router.all(handler)`

**handler:** A function with the signature `function(page)` that will be called before execution of the handler defined with `path`. This function can be called any number of times; handlers will be executed in the order they were registered. A good application of this is setting a stylesheet for all pages:


```javascript
router.all(function(page){
  page.setHeader(function(props){
    return ['link', {rel:'stylesheet', href:'/ice-assets/style.css'}]
  });
});
```


### Router.make

`router.make()`

Create an Express router instance from the Ice router in 'easy mode' that manages the build process internally, removing the need to call `Ice.build` by hand. When this function executes, it will set up a route that serves the bundle file from memory. _Because of high memory usage, this way of building Ice is not reccomended for production projects. Future releases of Ice should have a more memory-efficient automatic build process._


### Router.exportServer

`router.exportServer()`

Create an Express router instance from the Ice router. Can be mounted onto an express app with `app.use(router)` where `router` is the `Ice.Router` instance. _Note: mounting the router instance at a mountPoint other than '/' ie: `app.use('/foo', router)` will not work_


### Router.exportClient

`router.exportClient()`

Create a Backbone router instance from the Ice router. There is no need to call this function, as it is already called within `Ice.Build`. Internally, when `exportClient` is called, a Backbone.Router instance is created, then `Ice.History.start()` is called which starts the router listening for url changes.


## 2. <span id="page">Page</span>

A page instance is provided to every route handler. The idea is that when writing route handlers, you should stop thinking about the distinction between server and client, and imagine that the following functions and attributes are inherent parts of the 'page' that you are rendering

### Page.render

1. `page.render(component, props)`

1. `page.render(string)`

Render the React component or string to the page. The rendered entity will appear on the page in an elment with id "#app", which is a direct child of `<body>`. You should structure your application to flow from this top level component down to subcomponents that make up each page.


### Page.status

`page.status(statusCode)`

Sets the response code value.

**statusCode** is an integer HTTP response code. Returns the Page instance, so it's chainable.


### Page.getCookies

`page.getCookies()`

Returns a raw cookie string with all cookies that are visible on the page. The result will look something like "foo-bar; fizz=buzz;"


### Page.setCookie

`page.setCookie(name, value[, options])`

Set a cookie on the page. **name** and **value** are strings, and **options** supports the following:


### Page.visit

`page.visit(urlFragment)`

Go to the specified urlFragment

### Page.setHeader

`page.setHeader(headerFn)`

Add metadata elements to the HTML `<head>` element by supplying a function with a special signature.

**headerFn** must be a function that returns an array-of-arrays with each array being a series of arguments for React.createElement. You can also return just a single element. The `headerFn` will recieve a `props` argument which is a reference to the properties supplied in `page.render`. For example, the following sets a dynamic `<title>` and sets up the stylesheet for the page:

```javascript
page.setHeader(function(props){
  return [
    ['title', null, props.collection.models[0].get('name')],
    ['link', {rel:'stylesheet', href:'/ice-assets/style.css'}]
  ]
});
```
*In the future this method will be more flexible so as to not require the use of React*

## 3. <span id="model">Ice.Model</span>

The `Ice.Model` class implements the same API as [Backbone.Model](http://backbonejs.org/#Model) with a few added features. You should familiarize yourself with the Backbone documentation if you are confused about how to use `Ice.Model`.

### Model.populate

`model.populate(options)`

Makes a `fetch` but bootstraps the data it recieves to reduce network requests and speed up load times. As such, `populate` should be used only initial pageload or else you will see a warning about not being able to find bootstrapped data, although it will still perform the fetch. You can read more about how this works in the [How it Works](#how) section. Returns a promise.

**options:** supports all backbone fetch options. In addition, it provides a way to forward cookies from the client straight to the data source in the case of authenticated requests.

`options.forwardCookies` - a string of raw cookies to be sent along with the request. For example, to forward all cookies:

```javascript
model.populate({
  forwardCookies: page.getCookies()   //foo=bar;
})
```
**Note:** The `forwardCookies` option is available for `Model.fetch`, too


### Model.request

`model.request(opts)`

Perform an arbitray ajax-style request while taking advantage of isomorphism and the `forwardCookies` option. Returns a [superagent](https://github.com/visionmedia/superagent) request object, so you'll have to call `end()` to make the request. *Note: in the future this will probably return a promise*

##### Supported Options:
+ opts.url - the url of the request (required)
+ opts.method - the HTTP method that should be used (default: 'GET')
+ opts.data - an object that should be sent as JSON in the request body
+ opts.forwardCookies - raw cookies to be included in the request

For example (inside a route handler with `page` defined):
```javascript
Ice.Model.prototype.request({
  url: 'http://localhost:3000/data/me',
  method: 'GET',
  forwardCookies: page.getCookies()
}).end(function(err, res){
  if (err) return page.render('unauthorized')
  page.render('HELLO '+res.body.name);
});
```

### Model.getHash

`model.getHash(opts)`

This is an function that is used internally by `populate` to create a unique identifier for bootstrapped data. Generally you should not need to worry about this, but if you find you are getting warnings about bootstrapped data not being found, or if you are using a data source in which there is not a strict 1-to-1 mapping of resources and URLs, you might consider overriding it to something of your choosing. `getHash` is passed the request options object which should help to uniquely identify the request data. Should return a string.

## 4. <span id="collection">Ice.Collection</span>

The `Ice.Collection` class implements the same API as [Backbone.Collection](http://backbonejs.org/#Collection) with a few added features. You should familiarize yourself with the Backbone documentation if you are confused about how to use `Ice.Collection`.

### Collection.populate

`collection.populate(options)`

*See Model.populate*

### Collection.request

`model.request(opts)`

*See Model.populate*

### Collection.getHash

`collection.getHash(opts)`

*See Model.getHash*



## 5. <span id="iceBuild">Ice.build</span>

Accepts an instance of or reference to `Ice.Router`, returns a Node [Readable Stream](https://nodejs.org/api/stream.html#stream_class_stream_readable) of a client-ready script with all dependencies bundled. Uses [Browserify](https://github.com/substack/node-browserify).

##### Syntax:

1. `Ice.build(router[, browserifyOpts])`

1. `Ice.build(opts)`

##### Supported Options:

+ `opts.routerPath`     - an absolute path pointing to an instance of Ice.Router
+ `opts.router`         - an instance of Ice.Router
+ `opts.browserify`     - options that will be passed directly into [browserify](https://github.com/substack/node-browserify#browserifyfiles--opts)

If you use the first syntax, the second argument will be passed directly to browserify.
If you choose to use the second syntax, the browserify options should be nested under `browserify`

##### Examples:

```javascript
// First Syntax
var router = require('./router.js');
Ice.build(router, {
  transform: [require('reactify')]
});

// Second syntax
Ice.build({
  routerPath: './router.js'
});

// Second syntax with Browserify options
Ice.build({
  router: require('./router.js'),
  browserify: {
    transform: [require('reactify')]
  }
});
```


## 6. <span id="iceData">Ice.data</span>

Holds data that persists across the client and server. Can be used as a global variable for configuration or otherwise. 


## 7. <span id="how">How it Works</span>

Some key features and an explanation of their implementation

#### Isomorphic Router
The Ice.Router [API](#router) exposes two important functions that make isomorphism possible - `exportServer` and `exportClient`. When you create an Ice.Router class instance, its job is simply to collect route definitions and their handlers. When you call either of the export functions, the router is used as a blueprint for creating a new instance of either a [Backbone Router](http://backbonejs.org/#Router), or an [Express Router](http://expressjs.com/4x/api.html#router). The Ice.Router instance doesn't actually run, it provides instructions for building a router that will run in the appropriate environment.

#### Isomorphic Page object
Each route made with `router.path` is supplied a function handler with a reference to an instance of `Ice.Page`. The Page constructor switches depending on the context (client or server), but both client and server instances of Page expose an identical API. This is critical for providing compatibility with isomorphic code. On the server, each route is set up as an Express route with a handler that exposes a new Page instance with the `req` and `res` objects. On the client, the Backbone.Router and Backbone.History objects have been modified to register handlers that create page instances instead of the default behavoir.

#### Bootstrapped Models
The Ice [Model](#model) and [Collection](#collection) classes are subclasses of [Backbone.Model](http://backbonejs.org/#Model) and [Backbone.Collection](http://backbonejs.org/#Collection). In addition to all Backbone methods, they also expose a 'populate' function which is exactly like `fetch`, but handles bootstrapping.

Under the hood, when you call `populate()`, the Model/Collection will delegate to either `_fill` or `_initialFetch`, depending on the context (server or client). On the server, `_initialFetch` performs the usual fetch, but attaches the response to a global object (see [sharify](https://github.com/artsy/sharify)) which allows for the response data to be injected into the page when it is finally served to the client. On the client, `_fill` fills the model with any bootstrapped data it finds that matches the signature of the request. 

#### Build Process
The `Ice.build` function turns an `Ice.Router` instance into a single javascript file that will run in the browser. It uses [browserify](http://browserify.org) to bundle all dependencies of the application together, making sure to ignore all files that implement server-specific code.


## 8. <span id="caveats">Ice.js Caveats</span>

Ice was written to be flexible and modular, but there are some things you just can't do. One thing to keep in mind is that all of the setup code involving mounting a router instance onto Express is *not* part of the isomorphic application. The application is defined entirely by the Routers. Any code outside of a Router class will not be included in the application bundle.


#### Modular Routers
Any instance of `Ice.Router` that will be mounted onto an express server must be defined in its own module and `require`d into the scope of the Express app. 

##### Correct:
```javascript
//router.js
var router = module.exports = new Ice.Router;
router.path('/', function(){...});

//main.js
app.use(require('./router.js').make());
```

##### Incorrect:
```javascript
//main.js
var router new Ice.Router;
router.path('/', function(){...});
app.use(router.make());
```

If you do it the second way, the bundler will try to browserify `main.js` which contains server code, and it will break.


#### Mounting onto express
After calling `Router.exportServer` or `Router.make`, you must mount the router onto Express at the root location. This is because the client Router assumes the server Router has been mounted at '/'. Configuring the mountpoint to be anything else is outside the scope of the application and can't be accounted for.

##### Correct:
```javascript
app.use(router.make());
```

##### Incorrect:
```javascript
app.use('/foobar', router.make());
```


#### HTML Structure
Ice creates the HTML boilerplate for you. Each time you call `Page.render`, you'll be sending this to the client:

```html
<html lang="en">
  <head>[HTML header]</head>
  <body>
    <div id="app">[your top level component]</div>
    <div id="scripts">[Ice inner workings]</div>
  </body>
</html>
```
You have to use page.setHeader to modify the `<head>` element.


#### Consuming Data
The `Page` API is rather limited, as you may have noticed. Use Ice as a presentation layer on top of your application, not as a data source. Structure your application to have complete separation between view and presentation. You can do this in the same server instance with Express:

```javascript
var app = require('express')(),
    router = require('iceRouter.js');

app.get('/data', function(req, res){
  res.json({message: 'hello'})
})l

app.use(router.make());

app.listen(3000);

```

#### Top-level views
Ice is designed to render top-level views who handle all further rendering and interaction on their own. Don't try to build any kind of view hierarchy in Ice, and don't write any interaction code in your route handlers. Use ice to pass data from an external data source into a master view.
