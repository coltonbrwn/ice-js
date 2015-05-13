Ice = require('./app/node_modules/ice-js')
fs = require 'fs'
spawn = require('child_process').spawn

child = null


Monitor = (cb) ->
  called = 0
  register: -> ->
    called++
    if called == 2 then do cb


before 'Make browserify bundle', (done) ->

  monitor = new Monitor(done)

  console.log 'Building Application Bundle...\n'
  @timeout 5000
  router = require './app/routers'
  builder = Ice.build router
  dest = fs.createWriteStream "#{__dirname}/app/bundle.js"
  dest.on 'finish', monitor.register()
  builder.pipe dest

  console.log 'Starting Test Server...\n'
  child = spawn 'node', ['test/app'], {stdio: ['ipc']}
  child.stderr.pipe(process.stderr)
  child.on 'message', (m) ->
    if m is 'listening' then do monitor.register()

after 'Remove bundle', (done) ->
  fs.unlink("#{__dirname}/app/bundle.js", done)

after 'Kill the test server', (done) ->
  child.kill();
  done();