/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-disable global-require, no-confusing-arrow, max-len */

const path = require('path');
const webpack = require('webpack');
const AssetsPlugin = require('assets-webpack-plugin');
const pkg = require('../package.json');
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const isDebug = global.DEBUG === false ? false : !process.argv.includes('--release');
const isVerbose = process.argv.includes('--verbose') || process.argv.includes('-v');
const useHMR = !!global.HMR; // Hot Module Replacement (HMR)
const babelConfig = Object.assign({}, pkg.babel, {
  babelrc: false,
  cacheDirectory: useHMR,
  presets: pkg.babel.presets.map(x => x === 'latest' ? ['latest', { es2015: { modules: false } }] : x),
});

// Webpack configuration (main.js => public/dist/main.{hash}.js)
// http://webpack.github.io/docs/configuration.html
const config = {

  // The base directory for resolving the entry option
  context: path.resolve(__dirname, '../src'),

  // The entry point for the bundle
  entry: [
    /* Material Design Lite (https://getmdl.io) */
    '!!style-loader!css-loader!react-mdl/extra/material.min.css',
    'react-mdl/extra/material.min.js',
    /* The main entry point of your JavaScript application */
    './main.js',
  ],

  // Options affecting the output of the compilation
  output: {
    path: path.resolve(__dirname, '../public/dist'),
    publicPath: isDebug ? `http://localhost:${process.env.PORT || 3000}/dist/` : '/dist/',
    filename: isDebug ? '[name].js?[hash]' : '[name]-0.js',
    chunkFilename: isDebug ? '[id].js?[chunkhash]' : '[id].[chunkhash].js',
    sourcePrefix: '  ',
  },

  // Developer tool to enhance debugging, source maps
  // http://webpack.github.io/docs/configuration.html#devtool
  devtool: isDebug ? 'source-map' : false,

  // What information should be printed to the console
  stats: {
    colors: true,
    reasons: isDebug,
    hash: isVerbose,
    version: isVerbose,
    timings: true,
    chunks: isVerbose,
    chunkModules: isVerbose,
    cached: isVerbose,
    cachedAssets: isVerbose,
  },

  // The list of plugins for Webpack compiler
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': isDebug ? '"development"' : '"production"',
      __DEV__: isDebug,
    }),
    // Emit a JSON file with assets paths
    // https://github.com/sporto/assets-webpack-plugin#options
    new AssetsPlugin({
      path: path.resolve(__dirname, '../public/dist'),
      filename: 'assets.json',
      prettyPrint: true,
    }),
    new webpack.LoaderOptionsPlugin({
      debug: isDebug,
      minimize: !isDebug,
    }),
  ],

  // Options affecting the normal modules
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, '../src'),
          path.resolve(__dirname, '../components'),
        ],
        loader: 'babel-loader',
        options: babelConfig,
        exclude: /node_modules/,
      },
      {
        test: /\.css/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: isDebug,
              importLoaders: true,
              // CSS Modules https://github.com/css-modules/css-modules
              modules: true,
              localIdentName: isDebug ? '[name]_[local]_[hash:base64:3]' : '[hash:base64:4]',
              // CSS Nano http://cssnano.co/options/
              minimize: !isDebug,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              config: './tools/postcss.config.js',
            },
          },
        ],
      },
      {
        test: /\.json$/,
        exclude: [
          path.resolve(__dirname, '../src/routes.json'),
        ],
        loader: 'json-loader',
      },
      {
        test: /\.json$/,
        include: [
          path.resolve(__dirname, '../src/routes.json'),
        ],
        use: [
          {
            loader: 'babel-loader',
            options: babelConfig,
          },
          {
            loader: path.resolve(__dirname, './routes-loader.js'),
          },
        ],
      },
      {
        test: /\.md$/,
        loader: path.resolve(__dirname, './markdown-loader.js'),
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|otf|ttf)$/,
        loader: 'url-loader',
        options: {
          limit: 1000000,
        },
      },
      // { test: /\.(png|woff|woff2|eot|ttf|svg|otf)$/, loader: 'url-loader?limit=100000' },
      // { test: /\.svg$/, loader: 'url?limit=65000&mimetype=image/svg+xml&name=public/fonts/[name].[ext]' },
      //   { test: /\.woff$/, loader: 'url?limit=65000&mimetype=application/font-woff&name=public/fonts/[name].[ext]' },
      //   { test: /\.woff2$/, loader: 'url?limit=65000&mimetype=application/font-woff2&name=public/fonts/[name].[ext]' },
      //   { test: /\.[ot]tf$/, loader: 'url?limit=65000&mimetype=application/octet-stream&name=public/fonts/[name].[ext]' },
      //   { test: /\.eot$/, loader: 'url?limit=65000&mimetype=application/vnd.ms-fontobject&name=public/fonts/[name].[ext]' }
      {
        test: /\.(eot|ttf|wav|mp3)$/,
        loader: 'file-loader',
      },
    ],
  },
};

// Optimize the bundle in release (production) mode
if (!isDebug) {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    sourceMap: false,
    compress: {
      warnings: isVerbose,
    },
  }));
  config.plugins.push(new webpack.optimize.AggressiveMergingPlugin());
}

// Hot Module Replacement (HMR) + React Hot Reload
if (isDebug && useHMR) {
  babelConfig.plugins.unshift('react-hot-loader/babel');
  config.entry.unshift('react-hot-loader/patch', 'webpack-hot-middleware/client');
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
  config.plugins.push(new webpack.NoEmitOnErrorsPlugin());
}

module.exports = config;
