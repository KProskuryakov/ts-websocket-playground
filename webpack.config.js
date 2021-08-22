/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
    client: './src/client/Client.ts'
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        include: /src/
      },
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'public', to: '' }
      ]
    })
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: { "http": false }
  },
  output: {
    filename: '[name]-bundle.js',
    path: path.resolve(__dirname, "dist/public")
  },
  watchOptions: {
    ignored: [
      "node_modules",
      "test"
    ]
  }
};