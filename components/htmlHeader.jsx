var React = require('react');

var htmlHeader = React.createClass({

  render: function() {

    var metaTags = this.props.metadata.map(function(dataItem, i){
      dataItem.props || (dataItem.props = {});
      dataItem.props.key = i;
      return React.createElement(dataItem.type, dataItem.props, dataItem.children);
    });

    var title = this.props.pageTitle;

    return (
      <head>
        <meta charSet="utf-8" />
        <link rel="stylesheet" href={"/assets/style"+this.props.sd.CSS_EXT} />
        <link rel="chrome-webstore-item" href="https://chrome.google.com/webstore/detail/bmnlcjabgnpnenekpadlanbbkooimhnj"/>
        <link rel="icon" type="image/x-icon" href="http://46362e6d99dc8ccd2ae0-fbb611151208cbfcf9ccc8876a5d1e85.r17.cf1.rackcdn.com/honey_favicon.ico"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
        <meta name="keywords" content="Honey coupons browser extension shop online automatic free chrome firefox safari cart joinhoney joinhoney.com download install"/>
        {metaTags}
      </head>
    );
  }

});

module.exports = htmlHeader;