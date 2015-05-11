jsdom = require('jsdom')
assert = require('assert')
spawn = require('child_process').spawn

describe 'Test Server', ->
  child = null

  # Spawn an instance of the test server at port 3000,
  # listening for special message to confirm success
  # 
  before (done) ->
    child = spawn 'node', 
      ['test/test_server/index.js'], 
      {stdio: ['ipc']}
    child.stderr.on 'data', (err) ->
      done(new Error(err))
    child.on 'message', (m) ->
      if m is 'listening' then done()


  # Kill the server instance when we're done with
  # server-side tests
  # 
  after (done) ->
    child.kill();
    done();



  describe 'Test Routes', ->
   
    it '/ should be OK', (done) ->
      jsdom.env
        url: 'http://localhost:3000',
        done: (errors, window) ->
          app = window.document.getElementById 'app'
          assert.equal(app.innerHTML, 'home')
          done()
