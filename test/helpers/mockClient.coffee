jsdom = require('jsdom')

# Wraps JSDOM for easy testing with Ice-js.
# MockClient instances are initialized with a
# browserify bundle string, which should load
# the application
# 
class MockClient
  constructor: (@bundle) ->

  visit: (url, cb) ->
    document = jsdom.env
      html: '<div id="app">test</div>'
      url: url
      src: [@bundle]
      features:
        FetchExternalResources: ["script"],
        ProcessExternalResources: ["script"],
        SkipExternalResources: false
      done: (errors, window) ->
        err = if(errors) then new Error(errors[0]) else undefined
        setTimeout (-> cb(err, window)), 500

module.exports = MockClient