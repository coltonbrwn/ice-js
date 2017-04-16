var baseMethods = require('../lib/baseModel.js'),
    Backbone = require('backbone');

module.exports = Backbone.Collection.extend(baseMethods).extend({
  model: require('./Model.js')
});
