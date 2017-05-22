const { root } = require('./helpers');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtPlugin = require('script-ext-html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

/**
 * This is a client config which should be merged on top of common config
 */
module.exports = {
  entry: root('./src/main.browser.ts'),
  output: {
    publicPath: '/',
    path: root('dist/client'),
    filename: 'index.[hash].js'
  },
  target: 'web',
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled', // change it to `server` to view bundle stats
      reportFilename: 'report.html',
      generateStatsFile: true,
      statsFilename: 'stats.json',
    }),
    new HtmlWebpackPlugin({
      template: root('./src/index.ejs'),
      output: root('dist/client'),
      inject: false
    }),
    new ScriptExtPlugin({
      defaultAttribute: 'defer'
    })
  ]
};
