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
        err = processJsdomErrors errors
        setTimeout (-> cb(err, window)), 500

module.exports = MockClient


processJsdomErrors = (errors) ->
  if !errors then return undefined
  err = errors
  if errors.length?
    err = errors[0]
    if err.data?.error?
      err = err.data.error
  new Error err

