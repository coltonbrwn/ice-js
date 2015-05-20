assert = require 'assert'
mockClient = require '../../helpers/mockClient'

describe 'Test the demo application', ->
  window = null

  before (done) ->
    @timeout 5000
    client = new mockClient
      basePath: 'http://localhost:3000'
    client.visit '/demo', (err, _window) ->
      window = _window
      done err

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

  it 'dynamic header should be Flying Lotus', ->
    title = window.document.title
    assert.equal title, 'Flying Lotus'

  it 'should have a header set by the Router.all function', ->
    meta = window.document.getElementsByTagName('meta')[0]
    assert.equal meta.name, 'foobar'
  