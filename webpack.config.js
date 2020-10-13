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
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: { "http": false }
  },
  output: {
    filename: '[name]-bundle.js',
    path: path.resolve(__dirname, "public")
  },
  watchOptions: {
    ignored: /node_modules/
  }
};