
var browserify = require('browserify'),
    source = require('vinyl-source-stream');

module.exports.build = function(opts){
  return browserify('./node_modules/ice-js/lib/initClient.js', {
    fullPaths: true,
    paths: ['./node_modules/ice-js/node_modules'],
    transform: ['reactify'],
  }).ignore('./node_modules/ice-js/lib/serverRouter.js')
  .require(opts.routerPath, {
    expose: 'ice-router'
  }).bundle()
    .pipe(source('bundle.js'));
} 