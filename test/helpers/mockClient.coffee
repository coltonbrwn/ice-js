jsdom = require 'jsdom'
assert = require 'assert'
dummyPage = '<div id="app">test</div>'
_ = require('backbone/node_modules/underscore')

# Wraps jsdom for easy testing with Ice-js.
# opts:
#   (bool)    disableJavascript  - turn on/off javascript
#   (bool)    disablePageFetch   - turn on/off http page request
#   (string)  bundle     - application bundle to be executed
#   (string)  basePath  - for routing
#   (object)  consoleObj - recieves the window's console.log messages 
# 

module.exports = class MockClient
  constructor: (opts) ->
    @jsEnabled =  !opts.disableJavascript
    @html      = if opts.disablePageFetch then dummyPage else undefined
    @bundle    =    opts.bundle   or ''
    @basePath  =    opts.basePath or ''
    @console   =    opts.consoleObj or false
    @config    =    opts.config or {}

    @fetchExternal = if @jsEnabled and opts.fetchExternal isnt false then ["script"] else false
    @processExternal = if @jsEnabled and opts.processExternal isnt false then ["script"] else false
  
    return

  visit: (url, config, cb) ->

    if typeof cb is 'function'
      config = config || @config
    else if typeof cb is 'undefined'
      cb = config
      config = @config

    if url[0] isnt '/' then url = "/#{url}"
    document = jsdom.env _.extend config,
      html: @html
      url: @basePath + url
      src: [@bundle]
      features:
        FetchExternalResources: @fetchExternal
        ProcessExternalResources: @processExternal
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
    if !done? then throw new Error 'please supply a callback'
    @visit url, (err, window) ->
      if err then throw err
      app = window.document.getElementById 'app'
      done assert.equal app.innerHTML, expected



processJsdomErrors = (errors) ->
  if !errors then return undefined
  console.log(errors);
  err = errors
  if errors.length?
    err = errors[0]
    if err.data?.error?
      err = err.data.error
  new Error err
