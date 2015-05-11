module.exports = {

  arrayMerge: function (destArray, item) {
    if (item instanceof Array) {
      Array.prototype.push.apply(destArray, item);
    }else{
      Array.prototype.push.call(destArray, item);
    }
    return destArray;
  },

  safeString: function(rawString){
    // turns any string into a lowercase-hyphen-delimited-sentence
    if (!rawString) return '-';
    return rawString
      .substring(0,60)
      .toLowerCase()
      .replace('\'', '')
      .replace(/[^a-z0-9]+/g, '-')  // >=1 non-alphanumeric lwowercase chars
      .replace(/-$/,'');            // remove trailing - chars
  },

  isClient: function(){
    return typeof window !== 'undefined'
      && typeof process === 'undefined'
      && typeof __dirname === 'undefined'
  },

  isServer: function(){
    return ! this.isClient();
  },

  requireClient: function(){
    if (!this.isClient()) {
      throw "Client-only method seems to have been called "
        + "outside of a client context. This is not the "
        + "indended use";
    };
  },

  requireServer: function(){
    if (!this.isServer()) {
      throw "Server-only method seems to have been called "
        + "outside of a server context. This is not the "
        + "indended use";
    };
  }
}