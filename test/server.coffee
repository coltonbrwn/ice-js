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
   
    describe 'basic routing', ->
      it '/', (done) ->
        client.assertRender '/', 'home', done

      it '/aux', (done) ->
        client.assertRender '/aux', 'aux-ok', done

      it '/aux2', (done) ->
        client.assertRender '/aux2', 'aux2-ok', done


    describe 'parameterized routes', ->
      it '/concat/hello/world', (done) ->
        client.assertRender '/concat/hello/world', 'helloworld', done

      it '/concat/123/456', (done) ->
        client.assertRender '/concat/123/456', '123456', done

      it '/concat2/see/spot/run', (done) ->
        client.assertRender '/concat2/see/spot/run', 'seerun', done

      it '/concat2/hi/friend', (done) ->
        client.assertRender '/concat2/hi/friend', 'hifriend', done



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

