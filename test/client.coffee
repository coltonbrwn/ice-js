Ice = require('../ice.js')
jsdom = require('jsdom')
assert = require('assert')
fs = require('fs')

class mockClient
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
      created: (error, window) ->
        # jsdom.getVirtualConsole(window).sendTo(console);
      done: (errors, window) ->
        err = if(errors) then new Error(errors[0]) else undefined
        cb(err, window)

describe 'Test Client', ->
  bundle = null

  before 'Make browserify bundle', (done) ->
    @timeout 5000
    builder = Ice.build
      routerPath: './test/test_server/router.js'
      libRoot: '.'
    dest = fs.createWriteStream "#{__dirname}/test_server/bundle.js"
    dest.on 'finish', done
    builder.pipe dest

  after 'Remove bundle', (done) ->
    fs.unlink('./test/test_server/bundle.js', done)

  it 'Bundle should exist', ->
    bundle = fs.readFileSync "#{__dirname}/test_server/bundle.js"

  describe 'Test routes', ->
    window = null;

    # Load a dummy page, letting bundle.js do all the rendering
    # based on the supplied route string
    before (done) ->
      client = new mockClient(bundle)
      client.visit 'http://localhost:3000', (err, _window) ->
        window = _window
        done(err)

    it 'should say home', ->
      pageText = window.document.getElementById('app').innerHTML
      assert.equal(pageText, 'home')
