const webpack = require('webpack');
const helpers = require('./helpers');
const colors = require('colors');


const ENV = process.env.ENV = process.env.NODE_ENV = 'staging';
console.log(`Merging environment variables for STAGING`.green);

module.exports = helpers.mergeWebpackConfig({

});

