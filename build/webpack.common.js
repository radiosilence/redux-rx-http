
const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: "./dist/index.js",
    output: {
        filename: "bundle.js",
        path: path.resolve("./bundle")
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
        modules: [
          path.resolve('./dist'),
          path.resolve('./node_modules')
        ],
        alias: {
            styles: path.resolve('./src/styles'),
            apps: path.resolve('./src/apps'),
            assets: path.resolve('./assets'),
        }
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: "source-map-loader"
                //loaders: ['react-hot', 'babel-loader'],

            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
            'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            }
        })
    ],
};
