jsdom = require 'jsdom'
assert = require 'assert'
dummyPage = '<div id="app">test</div>'

# Wraps JSDOM for easy testing with Ice-js.
# opts:
#   (bool)    disableJavascript  - turn on/off javascript
#   (bool)    disablePageFetch   - turn on/off http page request
#   (string)  bundle     - application bundle to be executed
#   (string)  basePath  - for routing
#   (object)  consoleObj - recieves the window's console.log messages 
# 

module.exports = class MockClient
  constructor: (opts) ->
    @jsEnabled = if opts.disableJavascript then false else 'script'
    @html      = if opts.disablePageFetch then dummyPage else undefined
    @bundle    =    opts.bundle   or ''
    @basePath  =    opts.basePath or ''
    @console   =    opts.consoleObj or false
    return

  visit: (url, cb) ->
    if url[0] isnt '/' then url = "/#{url}"
    document = jsdom.env
      html: @html
      url: @basePath + url
      src: [@bundle]
      features:
        FetchExternalResources: [@jsEnabled],
        ProcessExternalResources: [@jsEnabled]
      created: (error, window) =>
        if error then return cb(error, null)
        if @console
          jsdom.getVirtualConsole(window).sendTo(@console);

        if @jsEnabled
          window.onPageDone = ->
            if !window.__done
              cb(error, window)
              window.__done = true
              
      done: (errors, window) ->
        if (err = processJsdomErrors errors) or !window.onPageDone
          cb(err, window)

  assertRender: (url, expected, done) ->
    @visit url, (err, window) ->
      if err then throw err
      app = window.document.getElementById 'app'
      done assert.equal app.innerHTML, expected



processJsdomErrors = (errors) ->
  if !errors then return undefined
  err = errors
  if errors.length?
    err = errors[0]
    if err.data?.error?
      err = err.data.error
  new Error err
