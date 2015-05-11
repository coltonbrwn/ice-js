jsdom = require('jsdom')
dummyPage = '<div id="app">test</div>'

# Wraps JSDOM for easy testing with Ice-js.
# MockClient instances are initialized with a
# browserify bundle string, which should load
# the application
# 
class MockClient
  constructor: (opts) ->
    @jsEnabled = if opts.jsEnabled then 'script' else false
    @bundle = opts.bundle or ''
    @html = if @jsEnabled then dummyPage else undefined

  visit: (url, cb) ->
    document = jsdom.env
      html: @html
      url: url
      src: [@bundle]
      features:
        FetchExternalResources: [@jsEnabled],
        ProcessExternalResources: [@jsEnabled]
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

