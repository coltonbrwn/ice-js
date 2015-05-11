Ice = require('./app/node_modules/ice-js')
assert = require('assert')
fs = require('fs')
mockClient = require './helpers/mockClient'

describe 'Test Client', ->
  bundle = null

  before 'Make browserify bundle', (done) ->
    @timeout 5000
    builder = Ice.build
      routerPath: __dirname+'/app/router.js'
    dest = fs.createWriteStream "#{__dirname}/app/bundle.js"
    dest.on 'finish', done
    builder.pipe dest

  after 'Remove bundle', (done) ->
    fs.unlink('./test/app/bundle.js', done)

  it 'Bundle should exist', ->
    bundle = fs.readFileSync "#{__dirname}/app/bundle.js"

  describe 'Test routes', ->
    client = null

    before ->
      client = new mockClient
        jsEnabled: true
        bundle: bundle

    it '/ should be OK', (done) ->
      client.visit 'http://localhost:3000/', (err, window) ->
        if err then throw err
        app = window.document.getElementById('app')
        assert.equal(app.innerHTML, 'home')
        done()

    it '/aux should be OK', (done) ->
      client.visit 'http://localhost:3000/aux', (err, window) ->
        if err then throw err
        app = window.document.getElementById('app')
        assert.equal(app.innerHTML, 'aux-ok')
        done()
