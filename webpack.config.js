const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const combineLoaders = require('webpack-combine-loaders');

const BUILD_DIR = path.resolve(__dirname, 'dist/public');
const APP_DIR = path.resolve(__dirname, 'src/client/views');

const config = {
  entry: [
    'babel-polyfill',
    APP_DIR + '/index.jsx'
  ],
  output: {
      publicPath: '/',
      path: BUILD_DIR,
      filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devServer: {
    historyApiFallback: true,
    proxy: {
      '/api/**': { target: 'http://localhost:8000' }
    }
  },
  devtool: 'source-map',
  plugins: [
    new ExtractTextPlugin('styles.css')
  ],
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        include: APP_DIR,
        loader: 'babel-loader',
        query: {
          presets: ["es2015","env","react"],
          plugins: ["transform-object-rest-spread"]
        }
      },
      {
        test: /\.js$/,
        include: APP_DIR,
        loader: 'babel-loader',
        query: {
          presets: ["es2015","env","react"],
          plugins: ["transform-object-rest-spread"]
        }
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              query: {
                modules: true,
                localIdentName: '[name]__[local]___[hash:base64:5]'
              }
            },
            'postcss-loader'
          ]
        }),
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              query: {
                modules: true,
                sourceMap: true,
                importLoaders: 2,
                localIdentName: '[name]__[local]___[hash:base64:5]'
              }
            },
            'sass-loader'
          ]
        }),
      },
      {
        test: /\.svg$/,
        use: [
          'svg-sprite-loader',
          'svgo-loader'
        ]
      }
    ]
  }
};

module.exports = config;
