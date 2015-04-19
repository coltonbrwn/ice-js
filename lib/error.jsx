var React = require('react');

var error = React.createClass({

  propTypes: {
    errorCode: React.PropTypes.number
  },

  getDefaultProps: function() {
    return {
      errorCode: 500
    };
  },

  render: function() {

    var errorText = ({
      404 : 'The requested page was not found',
      401 : 'Unauthorized',
      500 : 'Oops! something went wrong on our end'
    })[this.props.errorCode] || 'Unknown error';

    return (<div>
      <div id="error-main">
        <p className="err-code">{this.props.errorCode}</p>
        <p className="err-text">{errorText}</p>
      </div>
    </div>);
  }

});

module.exports = error;