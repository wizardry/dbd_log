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
      'vue-material': path.join(__dirname, 'node_modules/vue-material'),
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
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },{
            loader: 'style-loader',
          },{
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
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: /(node_modules)/,
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new StylelintPlugin({
      files: ['./src/**/*.vue', './src/**/*.scss'],
    }),
  ],
};
