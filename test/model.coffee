artistModel = require('./app/artistModel.js')
assert = require('assert')
spawn = require('child_process').spawn
sd = require('sharify').data
assertExtends = require('./helpers/assertExtends')
Backbone = require('backbone')

describe 'Test Model class', ->
  model = null

  before ->
    global.ICE_ENV = 'test'
    model = new artistModel
      name: 'Flying Lotus'

  after ->
    global.ICE_ENV = undefined

  it 'should have all ice base methods', ->
    methods = ['populate', 'request', 'getHash', '_fill', '_initialFetch']
    methods.forEach (method) ->
      assert.equal typeof model[method], 'function',
        "method '#{method}' was not found"

  it 'should expose a Backbone Model API', ->
    backboneModel = new Backbone.Model
    assertExtends model, backboneModel

  it 'fetch should work', (done) ->
    model.fetch().then ->
      done assert.equal model.get('mbid'), 'fc7376fe-1a6f-4414-b4a7-83f50ed59c92'

  it 'bootstrapping to sharify.data with _initialFetch', (done) ->
    model._initialFetch().then ->
      hash = model.getHash()
      savedData = sd.bsdata[hash].toString()
      localData = model.toJSON()
      assert.equal localData, savedData
    .done done