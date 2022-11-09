const path = require('path');

const { merge } = require('webpack-merge');
const paths = require('./paths');
const FL = require('./filename');
const env = require('./isDev');
const optimization = require('./optimization');

const devServer = require('./webpack.devServer.js');

const points = [];
if (env.isDev) {
  points.push('webpack/hot/dev-server');
}

points.push('./index.ts');

module.exports = merge(devServer, {

  target: 'web',
  devtool: env.isDev ? 'source-map' : false,

  entry: {
    script: points,
  },
  context: paths.src,
  mode: env.isDev ? 'development' : 'production',
  output: {
    filename: FL.filename('js'),
    path: paths.dist, // каталог в который будет выгружаться сборка.
    publicPath: 'auto',
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.css', '.scss'],
    alias: {
      '@styles': path.join(paths.src, 'shared', 'styles'),
      '@helpers': path.join(paths.src, 'shared', 'helpers'),
      '@pages': path.join(paths.src, 'pages'),
      '@components': path.join(paths.src, 'components'),
      '@shared': path.join(paths.src, 'shared'),
      '@': paths.src,
      comp: paths.components,
    },
  },

  optimization: optimization.optimization(),
});
