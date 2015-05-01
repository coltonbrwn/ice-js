
var browserify = require('browserify'),
    source = require('vinyl-source-stream');

module.exports = function(opts){

  var libRoot = opts.libRoot || './node_modules/ice-js';
  var bundleName = opts.bundleName || 'bundle.js';
  var routerPath = opts.routerPath || './router.js';

  return browserify(libRoot+'/lib/initClient.js', {
      paths: [libRoot+'/node_modules'],
      transform: ['reactify'],
    }).ignore(libRoot+'/lib/serverRouter.js')
      .ignore(libRoot+'/build.js')
      .require(opts.routerPath, {expose: 'ice-router'})
      .bundle()
      .pipe(source(bundleName));
      
} 