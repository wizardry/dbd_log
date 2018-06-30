const VueLoaderPlugin = require('vue-loader/lib/plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const path = require('path');

module.exports = {
  mode: process.env.WEBPACK_SERVE ? 'development' : 'production',
  entry: './src/index.js',
  output: {
    publicPath: './dist/',
    filename: './bundle.js',
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js'],
    alias: {
      '~': path.join(__dirname, 'src/'),
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          postLoaders: {
            js: 'babel-loader!eslint-loader',
          },
        },
      },
      {
        test: /\.js$/,
        exclude: [/node_modules/,/mock/],
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'eslint-loader',
            options: {
              fix: false,
              failOnError: false,
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader', {
          loader: 'sass-resources-loader',
          options: {
            resources: path.join(__dirname, 'src/scss/_variables.scss'),
          },
        }],
      },
      {
        test: /\.(jpg|png)$/,
        loaders: 'file-loader?name=[name].[ext]'
      }
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new StylelintPlugin({
      files: ['./src/**/*.vue', './src/**/*.scss'],
    }),
  ],
};
