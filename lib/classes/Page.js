var util = require('../util.js');

if (util.isClient()) {
  module.exports = require('../clientPage.js');
}else if(util.isServer()) {
  module.exports = require('../serverPage.js');
}