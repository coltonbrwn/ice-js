var Backbone = require('backbone'),
    IceRouter = require('./iceRouter.js'),
    $ = require('jquery'),
    router = require('ice-router'),
    iceHistory = require('./iceHistory.js');



module.exports = (function(){

  Backbone.$ = $;

  $.ajaxSetup({
    xhrFields: {
      withCredentials: true
    }
  });

  $(function(){
    window.r = router.export();
    iceHistory.start({pushState:true});

    console.log('client loaded');
  });

})();
