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
      done: (errors, window) ->
        err = if(errors) then new Error(errors[0]) else undefined
        setTimeout (-> cb(err, window)), 500


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
    client = null

    before ->
      client = new mockClient(bundle)

    it '/ should be OK', (done) ->
      client.visit 'http://localhost:3000/', (err, window) ->
        pageText = window.document.getElementById('app').innerHTML
        assert.equal(pageText, 'home')
        done()

    it '/aux should be OK', (done) ->
      client.visit 'http://localhost:3000/aux', (err, window) ->
        pageText = window.document.getElementById('app').innerHTML
        assert.equal(pageText, 'aux-ok')
        done()
