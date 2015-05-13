var Model = require('ice-js').Model;

module.exports = Model.extend({

  url: function(){
    return 'http://localhost:3000/data/artists/'+this.getID();
  },

  getID: function(){
    return this.get('name').replace(/\s+/g, '').toLowerCase();
  }

});