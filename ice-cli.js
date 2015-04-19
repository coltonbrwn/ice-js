
var argv = require('minimist')(process.argv.slice(2));

if(argv._.some(function(val){return val === 'watch'})){
  console.log(__dirname);
}