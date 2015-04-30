var util = require('../lib/util.js');

if (util.isClient()) {
  module.exports = require('../lib/clientPage.js');
}else if(util.isServer()) {
  module.exports = require('../lib/serverPage.js');
}