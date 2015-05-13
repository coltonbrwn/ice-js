var React = require('react');

var Demo = React.createClass({

  propTypes: {
    collection: React.PropTypes.object.isRequired
  },

  render: function() {
    return (
      <div>hello</div>
    );
  }

});

module.exports = Demo;