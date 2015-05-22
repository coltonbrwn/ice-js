var Ice = require('ice-js'),
    demoRouter = require('./demo.js'),
    testRouter = require('./testCases.js');
    
var Router = module.exports = new Ice.Router();

Router.use('/', testRouter);
Router.use('/demo', demoRouter);