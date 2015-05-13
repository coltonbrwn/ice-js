var React = require('react');

var TestComponent = React.createClass({

  render: function() {
    return (
      <div id="test-inner">This is a react component!</div>
    );
  }

});

module.exports = TestComponent;