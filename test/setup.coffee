Ice = require('./app/node_modules/ice-js')
fs = require 'fs'
spawn = require('child_process').spawn

child = null

console.info 'sup'

before 'Make browserify bundle', (done) ->
  @timeout 5000
  router = require './app/routers'
  builder = Ice.build router
  dest = fs.createWriteStream "#{__dirname}/app/bundle.js"
  dest.on 'finish', done
  builder.pipe dest

before 'Spin up test server', (done) ->
  child = spawn 'node', ['test/app'], {stdio: ['ipc']}
  child.stderr.pipe(process.stderr)
  child.on 'message', (m) ->
    if m is 'listening' then done()

after 'Remove bundle', (done) ->
  fs.unlink("#{__dirname}/app/bundle.js", done)

after 'Kill the test server', (done) ->
  child.kill();
  done();