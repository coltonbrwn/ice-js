##Ice.js

####What is it?
Ice is a small group of tools and APIs for making isomorphic javascript applications easy to build.
It runs server-side on top of Node and Express, and uses Backbone and React for UI rendering.

#####DRY
One goal of Ice is DRY isomorphic code. Ice wraps familiar javascript techonolgies with a single API that can run on either the client or the server.

#####MODULAR
Ice was developed to be modular and extensible, making it easy to manage complex applications or use Ice within a variety of programming patterns 

#####MINIMAL
Ice's API is small, and it aims to do one thing well: render dynamic webpages.

####What it isn't
Ice is not to be used as a data source, it has no methods for database access, shell commands, or anything I/O besides http. Ice relies on the existence an existing data source in the form of a REST API.


###A quick Hello World
```javascript
var Ice = require('ice-js'),
    express = require('express'),
    router = new Ice.Router,
    app = express();
    
router.path('/', function(page){
  page.render('Hello World!');
});

app.get('ice-assets/bundle.js', function(req, res){
  Ice.build(router).pipe(res);
};

app.use(router.make());

app.listen(3000);
```

#More docs coming ASAP
