var React = require('react');

var Artist = React.createClass({

  propTypes: {
    model: React.PropTypes.object.isRequired
  },

  render: function() {
    return (
      <div>
        {this.props.model.get('name')}
      </div>
    );
  }

});

module.exports = Artist;