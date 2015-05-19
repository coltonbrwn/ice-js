mockClient = require './helpers/mockClient'
artistModel = require './app/artistModel.js'
fs = require 'fs'
assert = require 'assert'

describe 'Cookies should work', ->
  client = null
  authCookie = null

  before 'Visit the page with javascript disabled', ->
    client = new mockClient
      basePath: 'http://localhost:3000'
      disableJavascript: true

  it "API should render 'unauthorized' without an auth cookie", (done) ->
    client.assertRender '/demo/profile', 
      'unauthorized', done

  it 'API should provide an auth cookie on login', (done) ->
    artist = new artistModel
    artist.login({password:'theword'})
      .end (err, res) ->
        authCookie = res.headers['set-cookie'][0]
        assert authCookie
        done err

  it.skip 'profile page should be accessible with cookie', (done) ->
    client.visit '/demo/profile', {document:cookie:authCookie}
      , (err, window) ->
        if err then throw new Error err
        app = window.document.getElementById 'app'
        done assert.equal app.innerHTML, 'HELLO Colton Brown'
