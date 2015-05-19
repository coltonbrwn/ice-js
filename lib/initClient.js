var Backbone = require('backbone'),
    IceHistory = require('../classes/History.js'),
    router = require('user-router-instance');

module.exports = (function(){

  (function(){
    window.r = router.exportClient();
    IceHistory.start({pushState:true});
  })();

})();
