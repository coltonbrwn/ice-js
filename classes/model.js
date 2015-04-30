var baseMethods = require('../lib/baseModel.js'),
    Backbone = require('Backbone');

module.exports = Backbone.Model
  .extend(baseMethods)
  .extend({__classType: 'Model'});