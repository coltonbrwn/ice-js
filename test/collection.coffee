artistsCollection = require('./app/artistsCollection.js')
assert = require('assert')
spawn = require('child_process').spawn
sd = require('sharify').data
assertExtends = require('./helpers/assertExtends')
Backbone = require('backbone')

describe 'Test Collection class', ->
  collection = null
  child = null

  before (done) ->
    child = spawn 'node', ['test/app'], {stdio: ['ipc']}
    child.stderr.pipe(process.stderr)
    child.on 'message', (m) ->
      if m is 'listening' then done()

  after (done) ->
    child.kill();
    done();

  before ->
    collection = new artistsCollection
    assert !sd.bsdata?
      
  it 'should have all ice base methods', ->
    methods = ['populate', 'authorize', 'getHash', '_fill', '_initialFetch']
    methods.forEach (method) ->
      assert.equal typeof collection[method], 'function',
        "method '#{method}' was not found"

  it 'should expose a Backbone Collection API', ->
    backboneCollection = new Backbone.Collection
    assertExtends collection, backboneCollection

  it 'fetch should work', (done) ->
    collection.fetch().then ->
      done assert.equal collection.length, 50

  it 'bootstrapping to sharify.data with _initialFetch', (done) ->
    collection._initialFetch().then ->
      hash = collection.getHash()
      savedData = sd.bsdata[hash].toString()
      localData = collection.toJSON()
      assert.equal localData, savedData
    .done done