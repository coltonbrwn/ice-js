Ice = require('./app/node_modules/ice-js')
assert = require('assert')
fs = require('fs')
mockClient = require './helpers/mockClient'

describe 'Test Client', ->
  bundle = null
  firstChunk = null

  before 'Make browserify bundle', (done) ->
    @timeout 5000
    router = require './app/routers'
    builder = Ice.build router
    builder.once 'data', (chunk) -> firstChunk = chunk
    dest = fs.createWriteStream "#{__dirname}/app/bundle.js"
    dest.on 'finish', done
    builder.pipe dest

  after 'Remove bundle', (done) ->
    fs.unlink('./test/app/bundle.js', done)

  it 'Bundle should exist', ->
    bundle = fs.readFileSync "#{__dirname}/app/bundle.js"

  it 'Alternate build syntax produces the same bundle', (done) ->
    @timeout 5000
    builder = Ice.build
      routerPath: __dirname+'/app/routers'
    .once 'data', (chunk) -> 
      assert.equal(chunk.toString(), firstChunk.toString())
      done();
      builder.end()
    .on 'error', (e) -> done e

  describe 'Test routes', ->
    client = null

    before ->
      client = new mockClient
        jsEnabled: true
        bundle: bundle
        basePath: 'http://localhost:3000'
        # consoleObj: console

    it '/ should be OK', (done) ->
      client.visit '/', (err, window) ->
        if err then throw err
        app = window.document.getElementById('app')
        done assert.equal(app.innerHTML, 'home')

    it 'auxiliary router should be registered', (done) ->
      client.visit '/aux', (err, window) ->
        if err then throw err
        app = window.document.getElementById('app')
        done assert.equal(app.innerHTML, 'aux-ok')

    it 'second auxiliary router should be registered', (done) ->
      client.visit '/aux2', (err, window) ->
        if err then throw err
        app = window.document.getElementById('app')
        done assert.equal(app.innerHTML, 'aux2-ok')

    describe 'parameterized routes', ->
      tests = [
        {path: '/concat/hello/world', result: 'helloworld'},
        {path: '/concat/123/456', result: '123456'},
        {path: '/concat2/see/spot/run', result: 'seerun'},
        {path: '/concat2/hi/friend', result: 'hifriend'},
      ].forEach (test) ->
        it "#{test.path} should render #{test.result}", (done) ->
          client.visit test.path, (err, window) ->
            if err then throw err
            app = window.document.getElementById('app')
            done assert.equal(app.innerHTML, test.result)

    describe 'glob routes', ->
      tests = [
        {path: '/abcd', status: 'ok'},
        {path: '/abRANDOM1234cd', status: 'ok'},
        {path: '/abcdx', status: 'test'}
      ].forEach (test) ->
        it "#{test.path} should be #{test.status}", (done) ->
          client.visit "#{test.path}", (err, window) ->
            if err then throw err
            app = window.document.getElementById('app')
            done assert.equal(app.innerHTML, test.status)

    describe 'regex routes', ->
      tests = [
        {path: '/fly', status: 'ok'},
        {path: '/zyxfly', status: 'ok'},
        {path: '/superflyflyz', status: 'test'}
      ].forEach (test) ->
        it "#{test.path} should render '#{test.status}'", (done) ->
          client.visit "#{test.path}", (err, window) ->
            if err then throw err
            app = window.document.getElementById('app')
            done assert.equal(app.innerHTML, test.status)

    it "parameters should work", (done) ->
      client.visit "/concat/hello/world", (err, window) ->
        if err then throw err
        app = window.document.getElementById('app')
        done assert.equal(app.innerHTML, 'helloworld')

