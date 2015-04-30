var Backbone = require('backbone'),
    IceHistory = require('../classes/History.js'),
    $ = require('jquery'),
    router = require('ice-router');

Backbone.$ = $;

module.exports = (function(){

  $.ajaxSetup({
    xhrFields: {
      withCredentials: true
    }
  });

  $(function(){
    window.r = router.exportClient();
    IceHistory.start({pushState:true});
    console.log('client loaded');
  });

})();
