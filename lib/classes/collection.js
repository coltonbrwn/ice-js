var baseMethods = require('./baseModel.js'),
    Backbone = require('Backbone');

module.exports = Backbone.Collection
  .extend(baseMethods)
  .extend({__classType: 'Collection'});