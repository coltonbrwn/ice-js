var Ice = require('ice-js'),
    demoRouter = require('./demo.jsx'),
    testRouter = require('./testCases.js');

var Router = module.exports = new Ice.Router();

Router.use('/', testRouter);
Router.use('/demo', demoRouter);