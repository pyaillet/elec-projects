var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './app/webpack.js',
  output: { path: __dirname, filename: 'bundle.js' },
  devServer: {
     headers: { "Access-Control-Allow-Origin": "*" }
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react'],
          plugins: [
            "syntax-async-functions",
            "transform-regenerator"
          ]
        }
      }
    ]
  },
};
