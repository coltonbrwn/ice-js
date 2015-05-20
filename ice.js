
module.exports = {

  Router: require('./classes/Router'),

  Model: require('./classes/model.js'),

  Collection: require('./classes/collection.js'),

  Page: require('./classes/Page'),

  History: require('./classes/History.js'),

  build: require('./lib/build.js'),

  data: require('sharify').data,

  createHeader: function(definition){
    return {
      render: function(props){
        var i=0;
        return definition(props).map(function(prop){
          return prop;
        });
      }
    }
  }
};