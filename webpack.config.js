const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
// const combineLoaders = require('webpack-combine-loaders');
const main = require('./src/config/main');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const devMode = process.env.NODE_ENV !== 'production';

const BUILD_DIR = path.resolve(__dirname, 'dist/public');
const APP_DIR = path.resolve(__dirname, 'src/client/views');

const gitRevisionPlugin = new GitRevisionPlugin();

const protocol = main.https ? 'https' : 'http'
const API_PORT = main.https ? 'https' : 'http'

const config = {
  entry: [
    'babel-polyfill',
    APP_DIR + '/index.jsx'
  ],
  output: {
      publicPath: main.mode == 'production' ? main.basename + '/' : '/',
      path: BUILD_DIR + '/',
      filename: 'js/bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devServer: {
    hot: true,
    historyApiFallback: true,
    host: main.hostname,
    contentBase: BUILD_DIR,
    compress: true,
    port: main.client_port,
    proxy: {
      '/api/**': { target: main.apiUrl }
    }
  },
  devtool: 'source-map',
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/styles.css',
      // filename: devMode ? '[name].css' : '[name].[hash].css',
      // chunkFilename: 'css/[id].css',
    }),
    new webpack.DefinePlugin({
      API_URL: JSON.stringify(main.apiUrl),
    	VERSION: JSON.stringify(main.version),
    	BASENAME: JSON.stringify(main.basename),
      STATIC_THRESHOLD: JSON.stringify(main.staticThreshold),
      CIRCLE_LIMIT: JSON.stringify(main.circleLimit),
    	HOME: JSON.stringify(protocol+'://'+main.hostname),
      GIT_VERSION: JSON.stringify(gitRevisionPlugin.version()),
      COMMIT_HASH: JSON.stringify(gitRevisionPlugin.commithash()),
      BRANCH: JSON.stringify(gitRevisionPlugin.branch()),
      GA_ID: JSON.stringify(main.ga_id),
      GDPR_URL: JSON.stringify(main.gdpr_url),
      DATASET_TABLE: (main.dataset_table ? true : false)
    }),
    new HtmlWebpackPlugin({
      hash: true,
      title: 'BlobToolKit - Viewer',
      template: './src/client/index.html',
      // filename: BUILD_DIR + '/index.html'
    })
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: APP_DIR,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.html$/,
        include: APP_DIR,
        use: [
          {
            loader: "html-loader"
          }
        ]
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
        test: /\.(sa|sc|c)ss$/,
        exclude: [
          /node_modules/,
          path.resolve(__dirname, '/src/client/views/components/style/node_modules.css')
        ],
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            query: {
              modules: true,
              sourceMap: true,
              importLoaders: 2,
              localIdentName: '[name]__[local]___[hash:base64:5]'
            }
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
      // {
      //   test: /\.css$/,
      //   include: [
      //     /node_modules/,
      //     path.resolve(__dirname, 'src/client/views/style/node_modules.css')
      //   ],
      //   use: [
      //     {
      //       loader: MiniCssExtractPlugin.loader,
      //       options: {
      //         hmr: process.env.NODE_ENV === 'development',
      //       },
      //     },
      //     {
      //       loader: 'css-loader',
      //       query: {
      //         modules: true,
      //         localIdentName: '[name]__[local]___[hash:base64:5]'
      //       }
      //     }
      //   ],
      // },
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
          name: 'img/[hash].[ext]',
          publicPath: main.mode == 'production' ? main.basename + '/' :'/'
        }
      }
    ]
  }
};

module.exports = config;
