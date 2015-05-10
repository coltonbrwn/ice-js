var browserify = require('browserify');

module.exports = function(opts){

  var libRoot = opts.libRoot || './node_modules/ice-js';
  var routerPath = opts.routerPath || './router.js';

  return browserify(libRoot+'/lib/initClient.js', {
      paths: [libRoot+'/node_modules'],
      transform: ['reactify'],
    }).ignore(libRoot+'/classes/Router/serverRouter.js')
      .ignore(libRoot+'/classes/Page/serverPage.js')
      .ignore(libRoot+'/lib/build.js')
      .require(routerPath, {expose: 'user-router-instance'})
      .require(libRoot+'/ice.js', {expose: 'ice-js'})
      .bundle();

};

