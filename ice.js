
module.exports = {

  Router: require('./classes/Router'),

  Model: require('./classes/Model'),

  Collection: require('./classes/Collection'),

  Page: require('./classes/Page'),

  History: require('./classes/History'),

  build: require('./lib/build.js'),

  data: require('sharify').data,

  createHeader: function(definition){
    var React = require('react');
    return {
      render: function(props){
        var items = [],
            defs = definition(props),
            key = 0;

        for(var prop in defs){
          var val = defs[prop]
          items.push(React.createElement('meta', {
            name: prop,
            content: val,
            key: key++
          }));
        }

        return items;
      }
    }
  }
};