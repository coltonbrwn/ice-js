var browserify = require('browserify'),
    path = require('path');

module.exports = function(router, opts){
  var routerPath, options = {};

  if (typeof router.getFilename === 'function') {
    routerPath = router.getFilename();
    options = opts.browserify || {};
  }else if(typeof opts === 'undefined'){
    opts = router;
    options = opts.browserify || {}
    if(opts.router && 
      typeof opts.router.getFilename === 'function'){
        router = opts.router;
        routerPath = router.getFilename();
    }else if(opts.routerPath){
      routerPath = path.resolve(opts.routerPath);
    }
  }

  if (typeof routerPath === 'undefined'){
    throw new Error('Invalid arguments. Please refer to '+
      'ice-js/DOCS.md#iceBuild');
  }

  // Test to make sure the routerPath points to a proper
  // module definition for an instance of Ice.Router
  var testRouter = require(routerPath);
  if(!testRouter.entries || !testRouter.middleware){
    throw new Error(
      "The object or path you supplied to Ice.build does \n"+
      "not point to a clean instance of Ice.Router. \n"+
      "This may be because the object you supplied was \n"+
      "not defined in its own module file first, or \n"+
      "because it is of some other type.\n"
    )
  }

  libRoot = path.resolve(__dirname+'/..');
  options.paths = [libRoot+'/node_modules'];

  return browserify(libRoot+'/lib/initClient.js', options)
      .ignore(libRoot+'/classes/Router/serverRouter.js')
      .ignore(libRoot+'/classes/Page/serverPage.js')
      .ignore(libRoot+'/lib/build.js')
      .require(libRoot+'/ice.js', {expose: 'ice-js'})
      .require(routerPath, {expose: 'user-router-instance'})
      .bundle();

};

