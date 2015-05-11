var browserify = require('browserify'),
    path = require('path');

module.exports = function(opts){

  var routerPath;
  if (typeof opts.getLocation === 'function') {
    var router = opts;
    routerPath = router.getLocation();
  }else if(opts.routerPath){
    routerPath = path.resolve(opts.routerPath);
  }else{
    throw 'missing required routerPath option'
  }
  
  libRoot = path.resolve(__dirname+'/..');

  return browserify(libRoot+'/lib/initClient.js', {
      paths: [libRoot+'/node_modules'],
      transform: ['reactify'],
    }).ignore(libRoot+'/classes/Router/serverRouter.js')
      .ignore(libRoot+'/classes/Page/serverPage.js')
      .ignore(libRoot+'/lib/build.js')
      .require(libRoot+'/ice.js', {expose: 'ice-js'})
      .require(routerPath, {expose: 'user-router-instance'})
      .bundle();

};

