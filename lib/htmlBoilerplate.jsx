var React   = require('react'),
    Head = require('./htmlHeader.jsx');

var Index = React.createClass({
  
  render: function() {

    var header = React.renderToStaticMarkup(
      React.createElement(Head, this.props));

    return(
      <html lang="en">
        <head dangerouslySetInnerHTML={{__html: header}} />
        <body>
          <div id="app" className="container" dangerouslySetInnerHTML={{__html: this.props.content}}/>

          <div id="scripts">
            <script dangerouslySetInnerHTML={{ __html: "window.__sharifyData = " + JSON.stringify(this.props.sd) }} />
            <script src="/ice-assets/client.js" />
          </div>

        </body>
      </html>
    );
  }
});

module.exports = Index;