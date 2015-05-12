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
      it '/abcd', (done) ->
        client.assertRender '/abcd', 'ok', done

      it '/abRANDOM1234cd', (done) ->
        client.assertRender '/abRANDOM1234cd', 'ok', done

      it '/abcdx', (done) ->
        client.assertRender '/abcdx', 'test', done


    describe 'regex routes', ->
      it '/fly', (done) ->
        client.assertRender '/fly', 'ok', done

      it '/zyxfly', (done) ->
        client.assertRender '/zyxfly', 'ok', done

      it '/superflyflyz', (done) ->
        client.assertRender '/superflyflyz', 'test', done


