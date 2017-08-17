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
          presets: ["es2015","react"],
        }
      },
      // {
      //   test : /\.scss$/,
      //   loader: //ExtractTextPlugin.extract(
      //     combineLoaders([
      //       {
      //         loader: 'style-loader'
      //       },
      //       {
      //         loader: 'sass-loader'
      //       },
      //       {
      //         loader: 'css-loader',
      //         query: {
      //           modules: true,
      //           localIdentName: '[name]__[local]___[hash:base64:5]'
      //         }
      //       }
      //     ])
      //   //)
      // }
            //      {
            //     test: /\.scss$/,
            //     loader: ExtractTextPlugin.extract('css-loader!sass-loader')
            // }
           {
                test: /\.css$/,
                exclude: /node_modules/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',

                    // Could also be write as follow:
                    // use: 'css-loader?modules&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader'
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

                    // Could also be write as follow:
                    // use: 'css-loader?modules&importLoader=2&sourceMap&localIdentName=[name]__[local]___[hash:base64:5]!sass-loader'
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
  }//,
  //debug: true
};

module.exports = config;
