var browserify = require('browserify'),
    Ice = require('../ice.js'),
    path = require('path');

module.exports = function(opts){

  var routerPath;
  if (typeof opts.getFilename === 'function') {
    var router = opts;
    routerPath = router.getFilename();
  }else if(opts.router && typeof opts.router.getFilename === 'function'){
    var router = opts.router;
    routerPath = router.getFilename();
  }else if(opts.routerPath){
    routerPath = path.resolve(opts.routerPath);
  }else{
    throw new Error('You did not supply a router '
      +'instance or routerPath:[path] option');
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

  return browserify(libRoot+'/lib/initClient.js', {
      extensions: opts.extensions,
      paths: [libRoot+'/node_modules'],
      transform: opts.transform,
    }).ignore(libRoot+'/classes/Router/serverRouter.js')
      .ignore(libRoot+'/classes/Page/serverPage.js')
      .ignore(libRoot+'/lib/build.js')
      .require(libRoot+'/ice.js', {expose: 'ice-js'})
      .require(routerPath, {expose: 'user-router-instance'})
      .bundle();

};

