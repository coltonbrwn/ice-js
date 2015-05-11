Router = require('../ice.js').Router
assert = require('assert')
Backbone = require('backbone')
express = require('express')
assertExtends = require('./helpers/assertExtends');

describe 'Test Router', ->
  router = null

  beforeEach ->
    router = new Router()

  it 'should have all methods', ->  
    methods = ['path', 'use', 'exportClient', 'exportServer', 'getLocation']
    methods.forEach (method) ->
      assert.equal typeof router[method], 'function',
        "method '#{method}' was not found"

  it 'should expose a backbone router API on client', ->
    clientRouter = router.exportClient()
    backboneRouter = new Backbone.Router
    assertExtends(clientRouter, backboneRouter)

  it 'should expose an express router API on server', ->
    serverRouter = router.exportServer()
    expressRouter = new express.Router()
    assertExtends(serverRouter, expressRouter)


