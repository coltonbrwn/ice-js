var Browser = require('zombie'),
    gulp = require('gulp'),
    express = require('express'),
    Ice = require('../ice.js'),
    jsdom = require('jsdom'),
    assert = require('assert'),
    fs = require('fs');


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


  describe.skip('Test Server', function () {

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

  describe('Test Client', function () {

    var window, document;
   
    before(function(done){

      this.timeout(5000);

      var bundle = fs.readFileSync(__dirname+'/test_server/bundle.js');

      document = jsdom.env({
        html: '<div id="app">test</div>',
        url: 'http://localhost:3000',
        // scripts: ['./test_server/test.js'],
        src: [bundle],
        features: {
          FetchExternalResources: ["script"],
          ProcessExternalResources: ["script"],
          SkipExternalResources: false
        },
        created: function(error, window){
          // jsdom.getVirtualConsole(window).sendTo(console);
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
   
    it('should load the application', function(){
      var pageText = document.getElementById('app').innerHTML;
      assert.equal(pageText, 'home');
    });

  });


});

