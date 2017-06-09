const webpack = require('webpack');
const helpers = require('./helpers');
const colors = require('colors');


const ENV = process.env.ENV = process.env.NODE_ENV = 'production';
console.log(`Merging environment variables for PRODUCTION`.green);

module.exports = helpers.mergeWebpackConfig({
    externals: {
        // Use external version of React
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: true
            }
        }),
        new webpack.optimize.AggressiveMergingPlugin(),
    ]
});

