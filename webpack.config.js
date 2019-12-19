
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {demo: "./src/demo.ts", index: "./src/index.ts"},
  output: {
    filename: "[name].js",
    path: path.resolve("./dist")
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
      },
      { test: /\.tsx?$/, loader: "ts-loader" },
      {
        test: /\.html$/,
        loader: "handlebars"
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'redux-rx-http demo',
      template: 'src/index.hbs',
      cdns: [],
      metas: [
        { "charset": "utf-8" },
        { "name": "author" },
        { "http-equiv": "x-ua-compatible", "content": "ie=edge" },
        { "name": "viewport", "content": "width=device-width, initial-scale=1" }
      ]
    }),
    new webpack.DefinePlugin({
      "process.env": {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    })
  ],
};
