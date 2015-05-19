var React   = require('react');

var Index = React.createClass({
  
  render: function() {
    return(
      <html lang="en">
        <head>
          {this.props.header}
        </head>
        <body>
          <div id="app"
               className="container"
               dangerouslySetInnerHTML={{
                 __html: this.props.content
               }}
          />
          <div id="scripts">
            <script dangerouslySetInnerHTML={{
                      __html: "window.__sharifyData = " + 
                        JSON.stringify(this.props.sd)
                    }}
            />
            <script src="/ice-assets/bundle.js" />
          </div>

        </body>
      </html>
    );
  }
});

module.exports = Index;