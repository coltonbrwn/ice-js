spawn = require('child_process').spawn
assert = require 'assert'
mockClient = require('./helpers/mockClient')

describe 'Test the demo application', ->
  child = null
  window = null

  before (done) ->
    @timeout 5000
    child = spawn 'node', ['demo'], {stdio: ['ipc']}
    child.stderr.pipe(process.stderr)
    child.on 'message', (m) ->
      if m is 'listening' then done()

  before (done) ->
    client = new mockClient
      basePath: 'http://localhost:3000'
    client.visit '/', (err, _window) ->
      window = _window
      done err

  after (done) ->
    child.kill();
    done();

  it 'Caribou should be rendered on the page', ->
    app = window.document.getElementById 'app'
    nodes = app.children[0]._childNodes
    assert.equal nodes[4].innerHTML, 'Caribou'

  it 'There should be bootstrapped data', ->
    bsdata = window.__sharifyData.bsdata
    assert.notEqual Object.keys(bsdata).length, 0

  it 'Caribou should also be in the bootstrapped data', ->
    bsdataKey = 'bsdata:http-localhost-3000-data-artists'
    data = window.__sharifyData.bsdata[bsdataKey]
    artistModel = data[4]
    assert.equal artistModel.name, 'Caribou'