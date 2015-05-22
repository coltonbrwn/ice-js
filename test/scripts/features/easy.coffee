mockClient = require '../../helpers/mockClient'
http       = require 'http'
assert     = require 'assert'
fs         = require 'fs'

describe 'easy mode should work, using router.make()', ->

  describe 'it should work server-side', ->
    client1 = null

    before ->
      client1 = new mockClient
        basePath: 'http://localhost:3000/easy'
        disableJavascript: true

    it 'should do the echo', (done) ->
      client1.assertRender '/echo/sup', 'sup', done

  
  describe 'it sould work client-side', ->
    client2 = null
    bundle = null

    before 'download the bundle from the easy server', (done) ->
      @timeout 5000
      http.get 'http://localhost:3000/easy/ice-assets/bundle.js', (res) ->
        assert.equal res.statusCode, 200
        res.pipe fs.createWriteStream(__dirname+'/../../easyBundle.js')
          .on 'close', done
      .on 'error', (e) ->
        done e

    before ->
      bundle = fs.readFileSync __dirname+'/../../easyBundle.js'
      client2 = new mockClient
        basePath: 'http://localhost:3000/easy'
        disablePageFetch: true
        bundle: bundle
        consoleObj: console

    it 'should do the echo', (done) ->
      @timeout 5000
      client2.assertRender '/echo/sup', 'sup', done

    after ->
      fs.unlink __dirname+'/../../easyBundle.js'