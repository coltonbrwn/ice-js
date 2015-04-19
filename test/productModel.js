var Model = require('ice-js').Model,
    Backbone = require('backbone'),
    BaseMethods = require('ice-js/lib/classes/baseModel.js');

module.exports = Backbone.Model.extend({
  urlRoot: 'http://data.joinhoney.com/products'
}).extend(BaseMethods);