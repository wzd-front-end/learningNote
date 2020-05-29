const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = {
  entry: "./src/index.ts",
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '../dist')

  },
  resolve: {
    // ts与tsx的区别是tsx包含jsx
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  devtool: process.env.NODE_ENV === 'production' ? false : 'cheap-module-inline-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, '../dist'),
    stats: 'errors-only',
    compress: false,
    host: 'localhost',
    port: 8080
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/index.html')
    }),
    new CleanWebpackPlugin()
  ]
}
