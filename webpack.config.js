var path = require("path")
var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker')

module.exports = {
  context: __dirname,

  // where to find the files that we want! 
  // entry means "entry-point"
  entry: {
    // bundle name: location
    'playlist': './assets/playlist/js/playlist',
    'explore-music': './assets/playlist/js/explore-music',
    'explore-playlist': './assets/playlist/js/explore-playlist',
    'explore-dj': './assets/playlist/js/explore-dj',
    'details': './assets/playlist/js/details',
    'graph': './assets/playlist/js/graph',
    'search': './assets/playlist/js/search',
    'chart': './assets/playlist/js/chart',
    'shows': './assets/playlist/js/shows'
  },

  output: {
      // Where to put the compiled bundles
      path: path.resolve('./assets/bundles/'),
      // What to name the compiled bundles
      filename: "[name].js",
  },

  plugins: [
    // Output status of webpack, communicates with django-webpack-loader
    new BundleTracker({filename: './webpack-stats.json'}),
  ],

  module: {
    // configuration for the javascript compilation
    loaders: [
      { 
        test: /\.jsx?$/, 
        exclude: /node_modules/,
        // babel does the actual compilation
        loader: 'babel-loader', 
        query: {
            // env gives us all modern syntax, react gives JSX
            presets: ['env', 'react']
        },
      }
    ],
  },

  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.jsx']
  },
}