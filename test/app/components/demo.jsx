var React = require('react'),
    Artist = require('./Artist.jsx');

var Demo = React.createClass({

  propTypes: {
    collection: React.PropTypes.object.isRequired
  },

  render: function() {

    var artists = this.props.collection.map(function(model, i){
      return <Artist model={model} key={i} />
    });

    return (
      <div>{artists}</div>
    );
  }

});

module.exports = Demo;