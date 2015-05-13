var Collection = require('ice-js').Collection,
    artistModel = require('./artistModel.js');

module.exports = Collection.extend({

  url: 'http://localhost:3000/data/artists',

  model: artistModel

});