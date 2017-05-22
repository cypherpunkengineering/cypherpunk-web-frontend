const { root } = require('./helpers');
const nodeExternals = require('webpack-node-externals');

/**
 * This is a server config which should be merged on top of common config
 */
module.exports = {
  entry: root('./src/main.server.ts'),
  output: {
    path: root('dist/server'),
    filename: 'index.js'
  },
  target: 'node',
  externals: [nodeExternals()]
};
