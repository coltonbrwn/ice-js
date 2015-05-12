mockClient = require('./helpers/mockClient')
assert = require('assert')
spawn = require('child_process').spawn

describe 'Test Server', ->
  child = null

  # Spawn an instance of the test server at port 3000,
  # listening for special message to confirm success
  # 
  before (done) ->
    child = spawn 'node', ['test/app'], {stdio: ['ipc']}
    child.stderr.on 'error', (err) ->
      errorReporter.emit('error', err)
    child.on 'message', (m) ->
      if m is 'listening' then done()

  # Kill the server instance when we're done with
  # server-side tests
  # 
  after (done) ->
    child.kill();
    done();


  describe 'Test Routes', ->
    client = null

    before ->
      client = new mockClient
        jsEnabled: false
        basePath: 'http://localhost:3000'

   
    it '/ should be OK', (done) ->
      client.visit '/', (err, window) ->
        if err then throw err
        app = window.document.getElementById 'app'
        assert.equal(app.innerHTML, 'home')
        done()

    it '/aux should be OK', (done) ->
      client.visit '/aux', (err, window) ->
        if err then throw err
        app = window.document.getElementById 'app'
        assert.equal(app.innerHTML, 'aux-ok')
        done()

    it '/aux2 should be OK', (done) ->
      client.visit '/aux2', (err, window) ->
        if err then throw err
        app = window.document.getElementById 'app'
        assert.equal(app.innerHTML, 'aux2-ok')
        done()
