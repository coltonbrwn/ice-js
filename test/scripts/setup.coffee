fs    = require 'fs'
spawn = require('child_process').spawn
Ice   = require '../app/node_modules/ice-js'

child = null

# do the callback when register is called twice
Monitor = (cb) ->
  called = 0
  register: -> ->
    called++
    if called == 2 then do cb

cleanup = ->
  fs.unlink "#{__dirname}/../app/bundle.js"
  if child?.kill? then child.kill()

process.on 'exit', cleanup

before 'Make browserify bundle', (done) ->

  monitor = new Monitor(done)

  console.log 'Building Application Bundle...\n'
  @timeout 15000
  router = require '../app/routers'
  builder = Ice.build {
    router: router, 
    browserify: {
      transform: require('reactify'), 
      extensions: ['.jsx']
    }
  }
  builder.on 'error', (e) -> done(e)
  
  dest = fs.createWriteStream "#{__dirname}/../app/bundle.js"
  dest.on 'finish', monitor.register()
  dest.on 'error', (e) -> done(e)
  builder.pipe dest

  console.log 'Starting Test Server...\n'
  child = spawn 'node', ['test/app'], {stdio: ['ipc']}
  child.stderr.pipe(process.stderr)
  child.stdout.pipe(process.stdout)
  child.on 'message', (m) ->
    if m is 'listening' then do monitor.register()

after 'Remove bundle, Kill the test server', ->
  cleanup()