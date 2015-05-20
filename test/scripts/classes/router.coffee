assert        = require 'assert'
Backbone      = require 'backbone'
express       = require 'express'
assertExtends = require '../../helpers/assertExtends'
Ice           = require '../../../ice.js'


describe 'Test Router class', ->
  router = null

  before ->
    router = new Ice.Router()

  it 'should have all ice router methods', ->  
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