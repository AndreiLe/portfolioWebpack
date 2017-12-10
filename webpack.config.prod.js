'use strict';

const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlCriticalPlugin = require("html-critical-webpack-plugin");

var baseConfig = {
  context: path.join(__dirname, '/src/'),
  entry: {
    common: ['./common.js','./style.sass'] 
  },
  output: {
    filename: 'js/[name].min.[hash].js',
    path: path.join(__dirname, '/bin')
  },
  devtool: false,
  module: {
    rules: [{
        test: /\.svg$|\.png|\.jpe?g|\.gif$/,
        loader: 'file-loader',
        options: {
          name: "img/[name].[ext]?[hash]"
        },
        include: path.join(__dirname, '/assets/img')
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        include: path.join(__dirname, '/src')
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })

      },
      {
        test: /\.sass$/,
        //reload if sass changed
        use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
          //if sass and css work wrong, call style-loader
          fallback: 'style-loader',
          //resolve-url-loader may be chained before sass-loader if necessary
          use: [{
              loader: 'css-loader',
              options: {
                minimize: { discardComments: { removeAll: true } }
              }
            },
            //add postcss to css with autoprefixer
            {
              loader: 'postcss-loader',
              options: {
                plugins: (loader) => [
                  require('autoprefixer'),
                ]
              }
            },
            //add url absolute path (img and other), sass must be with sourcemap
            {
              loader: 'resolve-url-loader'
            }, {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
                includePaths: [
                  path.join(__dirname, '/src')
                ]
              }
            }
          ]
        }))
      }
    ]
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    //clear bin dir before
    new CleanWebpackPlugin(['bin'], {
      root: __dirname,
      verbose: true,
      dry: false
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: false,
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        minifyCSS: true,
        minifyJS: true
      }
    }),
    //create style file from css or sass
    new ExtractTextPlugin({
      filename: "style.min.[hash].css",
      allChunks: true
    }),
    /*new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    }),*/
    new CopyWebpackPlugin([
      { from: '../assets/fonts/fonts', to: 'fonts/' },
      { from: '../assets/the_favicon/', to: 'the_favicon/' }
    ]),
    new HtmlCriticalPlugin({
      base: path.join(__dirname, '/bin'),
      src: 'index.html',
      dest: 'index.html',
      inline: true,
      minify: true,
      extract: false,
      width: 1300,
      height: 900,
      ignore: [/url\(data:image\/gif;base64/],
      penthouse: {
        blockJSRequests: false,
      }
    })
  ]
};

// export configuration
module.exports = baseConfig;