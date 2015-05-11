var browserify = require('browserify'),
    path = require('path');

module.exports = function(opts){
  
  if(!opts.routerPath) throw 'missing required routerPath option'
  routerPath = path.resolve(opts.routerPath);
  libRoot = path.resolve(__dirname+'/..');

  return browserify(libRoot+'/lib/initClient.js', {
      paths: [libRoot+'/node_modules'],
      fullPaths: true,
      transform: ['reactify'],
    }).ignore(libRoot+'/classes/Router/serverRouter.js')
      .ignore(libRoot+'/classes/Page/serverPage.js')
      .ignore(libRoot+'/lib/build.js')
      .require(libRoot+'/ice.js', {expose: 'ice-js'})
      .require(routerPath, {expose: 'user-router-instance'})
      .bundle();

};

