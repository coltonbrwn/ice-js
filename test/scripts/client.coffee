assert     = require 'assert'
fs         = require 'fs'
mockClient = require '../helpers/mockClient'
Ice        = require '../app/node_modules/ice-js'

describe 'Test Client', ->
  client = null

  before 'Load bundle into mock client', ->
    bundle = fs.readFileSync "#{__dirname}/../app/bundle.js"
    client = new mockClient
      disablePageFetch: true
      bundle: bundle
      basePath: 'http://localhost:3000'
      # consoleObj: console

  describe 'Test routes', ->
    client = null

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

    describe 'query parameters', ->
      it '/query?firstname=robert&lastname=paulson', (done) ->
        client.assertRender '/query?first=robert&last=paulson'
          , 'his name is robert paulson', done

      it '/queryMath/?a=1&b=3&c=3&d=7', (done) ->
        client.assertRender '/queryMath/?a=1&b=3&c=3&d=7'
          , '1337', done


