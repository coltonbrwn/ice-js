mockClient = require('./helpers/mockClient')
assert = require('assert')
spawn = require('child_process').spawn
http = require('http')

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

  # Kill the server instance when we're done
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
        done assert.equal(app.innerHTML, 'home')

    it '/aux should be OK', (done) ->
      client.visit '/aux', (err, window) ->
        if err then throw err
        app = window.document.getElementById 'app'
        done assert.equal(app.innerHTML, 'aux-ok')

    it '/aux2 should be OK', (done) ->
      client.visit '/aux2', (err, window) ->
        if err then throw err
        app = window.document.getElementById 'app'
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
        {path: '/abcd', status: 200},
        {path: '/abRANDOM1234cd', status: 200},
        {path: '/abcdx', status: 404}
      ].forEach (test) ->
        it "#{test.path} should return #{test.status}", (done) ->
          http.get 'http://localhost:3000'+test.path, (res) ->
            done assert.equal(res.statusCode, test.status)

    describe 'regex routes', ->
      tests = [
        {path: '/xxxfly', status: 200},
        {path: '/zyxflyz', status: 404}
      ].forEach (test) ->
        it "#{test.path} should return #{test.status}", (done) ->
          http.get 'http://localhost:3000'+test.path, (res) ->
            done assert.equal(res.statusCode, test.status)

