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
    window.r = new IceRouter(router);
    iceHistory.start({pushState:true});
    window.h = iceHistory;
    console.log('client loaded');
  });

})();
