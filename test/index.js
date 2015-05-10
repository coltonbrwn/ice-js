var Ice = require('../ice.js'),
    jsdom = require('jsdom'),
    assert = require('assert'),
    fs = require('fs'),
    spawn = require('child_process').spawn;


describe('Test Server', function(){

  var child;

  before(function(done){
    child = spawn('node', ['test/test_server/index.js'], {
      customFds: [0, 1, 2],
      stdio: ['ipc']
    });
    child.stderr.on('data', function(err) {
      done(new Error(err));
    });
    child.on('message', function(m){
      if(m === 'listening') return done()
    })
  });

  after(function(done){
    child.kill();
    done();
  })

  describe('Test Content', function () {

    var window, document;
   
    before(function(done){
      jsdom.env({
        url: 'http://localhost:3000',
        done: function(errors, win){
          window = win;
          document = win.document;
          done();
        }
      });
    });
   
    it('should say home', function(){
      var pageText = document.getElementById('app').innerHTML;
      assert.equal(pageText, 'home');
    });
   
  });

});








describe('Test Build Process', function(){

  before('Make browserify bundle', function(done){
    this.timeout(5000);
    var builder = Ice.build({
      routerPath: './test/test_server/router.js',
      libRoot: '.'
    });
    var dest = fs.createWriteStream(__dirname+'/test_server/bundle.js');
    dest.on('finish', done);
    builder.pipe(dest);
  });

  after('Removing bundle', function(done){
    fs.unlink('./test/test_server/bundle.js', done);
  });

  it('bundle should exist', function(){
    assert(fs.existsSync(__dirname+'/test_server/bundle.js'));
  });


  describe('Test Client', function () {

    var window, document;
   
    before(function(done){
      var bundle = fs.readFileSync(__dirname+'/test_server/bundle.js');
      document = jsdom.env({
        html: '<div id="app">test</div>',
        url: 'http://localhost:3000',
        src: [bundle],
        features: {
          FetchExternalResources: ["script"],
          ProcessExternalResources: ["script"],
          SkipExternalResources: false
        },
        created: function(error, window){
          jsdom.getVirtualConsole(window).sendTo(console);
        },
        done: function(errors, win){
          window = win;
          document = win.document;
          if(errors){
            done( new Error(errors[0]) );
          }else{
            done()
          }
        }
      });
    });
   
    it('should say home', function(){
      var pageText = document.getElementById('app').innerHTML;
      assert.equal(pageText, 'home');
    });

  });


});

