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
    return global.ICE_ENV === 'client' || global.ICE_ENV === 'test';
  },

  isServer: function(){
    return global.ICE_ENV === 'server' || global.ICE_ENV === 'test';
  },

  requireClient: function(){
    if (!this.isClient()) {
      throw new Error("Client-only method was called "
        + "outside of a client context. This is not the "
        + "indended use");
    };
  },

  requireServer: function(){
    if (!this.isServer()) {
      throw new Error("Server-only method was called "
        + "outside of a server context. This is not the "
        + "indended use");
    };
  }
}