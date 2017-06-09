const webpack = require('webpack');
const helpers = require('./helpers');
const colors = require('colors');


const ENV = process.env.ENV = process.env.NODE_ENV = 'development';
console.log(`Merging environment variables for DEVELOPMENT`.green);

module.exports = helpers.mergeWebpackConfig({

});

