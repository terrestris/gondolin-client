// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

module.exports = {

  mode: 'development',

  // devtool: 'inline-source-map',

  entry: {
    app: [
      'babel-polyfill',
      './app/index.js'
    ]
  },

  output: {
    path: path.join(__dirname, 'build'),
    filename: 'index.js'
  },

  devServer: {
    host: '0.0.0.0',
    port: 8888,
    disableHostCheck: true
  },

  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules\/(?!@terrestris)/,
      loader: 'babel-loader'
    }, {
      test: /\.css$/,
      loaders: [
        'style-loader',
        'css-loader'
      ]
    }, {
      test: /\.less$/,
      loaders: [
        'style-loader',
        'css-loader',
        {
          loader: 'less-loader',
          options: {
            javascriptEnabled: true,
            // TODO Refactor this
            modifyVars: (() => {
              return {
                '@primary-color': '#0e1058',
                '@link-color': '#b94800',
                '@border-radius-base': '2px'
              };
            })()
          }
        }
      ]
    }, {
      test: /\.(eot|svg|ttf|woff|woff2)(\?.*$|$)/,
      exclude: [
        path.resolve(__dirname, './app/resources/img')
      ],
      loader: 'file-loader?name=font/[hash].[ext]'
    }, {
      test: /\.(jpe?g|png|gif|svg)$/i,
      loaders: [
        'file-loader?hash=sha512&digest=hex&name=img/[hash].[ext]',
        'image-webpack-loader'
      ]
    }]
  },

  resolve: {
    alias: {
      react: path.join(__dirname, 'node_modules', 'react'),
      ol: path.join(__dirname, 'node_modules', 'ol')
    }
  },

  plugins: [
    new CopyWebpackPlugin([{
      from: 'app/index.html',
      to: 'index.html'
    }, {
      from: 'app/UploadWorker.js',
      to: 'UploadWorker.js'
    }]),

    new webpack.LoaderOptionsPlugin({
      options: {
        worker: {
          output: {
            filename: 'app/UploadWorker.js',
            chunkFilename: '[id].uploadworker.js'
          }
        }
      }
    })
    // outcomment to see live stats
    // ,new BundleAnalyzerPlugin({
    //   generateStatsFile: true
    // })
  ]
};
