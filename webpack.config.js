const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const combineLoaders = require('webpack-combine-loaders');
const main = require('./src/config/main');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
      filename: 'js/bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devServer: {
    historyApiFallback: true,
    host:main.hostname,
    proxy: {
      '/api/**': { target: 'http://localhost:8000' }
    }
  },
  devtool: 'source-map',
  plugins: [
    new ExtractTextPlugin('css/styles.css'),
    new webpack.DefinePlugin({
      API_URL: JSON.stringify(main.apiUrl),
    	VERSION: JSON.stringify(main.version),
    	BASENAME: JSON.stringify(main.basename)
    }),
    new HtmlWebpackPlugin({
      hash: true,
      title: 'BlobToolKit Viewer '+main.version,
      template: './src/client/index.html',
      filename: BUILD_DIR + '/index.html'
    })
  ],
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        include: APP_DIR,
        loader: 'babel-loader',
        query: {
          presets: ["es2015","env","react"],
          plugins: [
            "transform-object-rest-spread"
          ]
        }
      },
      {
        test: /\.js$/,
        include: [APP_DIR,/node_modules\/save-svg-as-png/],
        loader: 'babel-loader',
        query: {
          presets: ["es2015","env","react"],
          plugins: [
            "transform-object-rest-spread"
          ]
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
            options: { singleton: true }
          },
          {
            loader: 'css-loader',
            options: {
              modules: false
            }
          }
        ],
        include: [
          /node_modules/,
          path.resolve(__dirname, 'src/client/views/style/node_modules.css')
        ]
      },
      {
        test: /\.css$/,
        exclude: [
          /node_modules/,
          path.resolve(__dirname, '/src/client/views/components/style/node_modules.css')
        ],
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
      },
      {
        test: /\.(gif|png|jpe?g)$/i,
        loader: 'file-loader',
        options: {
          name: 'img/[hash].[ext]'
        }
      }
    ]
  }
};

module.exports = config;
