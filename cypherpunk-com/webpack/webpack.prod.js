/**
 * This is a prod config to be merged with the Client config
 */

const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      comments: false,
      compress: {
        screw_ie8: true,
        warnings: false,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true
      },
      mangle: {
        keep_fnames: true,
        screw_ie8: true
      },
      sourceMap: true
    })
  ]
};
