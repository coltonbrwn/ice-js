Ice = require('../ice.js')
jsdom = require('jsdom')
assert = require('assert')
fs = require('fs')

class mockClient
  constructor: (@bundle) ->

  visit: (url, cb) =>
    jsdom.env
      html: '<div id="app">test</div>'
      url: url
      src: [@bundle]
      features:
        FetchExternalResources: ["script"],
        ProcessExternalResources: ["script"],
        SkipExternalResources: false
      done: (errors, window) ->
        err = if errors then new Error(errors[0]) else undefined
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

  # after 'Remove bundle', (done) ->
  #   fs.unlink('./test/test_server/bundle.js', done)

  # it 'Bundle should exist', ->
  #   bundle = fs.readFileSync "#{__dirname}/test_server/bundle.js"

  describe 'Test Routes', ->
    client = null

    before (done) ->
      client = new mockClient(bundle)
      done()

    it '/ should be OK', (done) ->
      client.visit 'http://localhost:3000/', (err, window) ->
        if err then done err
        pageText = window.document.getElementById('app').innerHTML
        done assert.equal(pageText, 'home')




