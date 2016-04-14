module.exports = {
  cache: process.env.NODE_ENV === 'production',
  debug: process.env.NODE_ENV !== 'production',
  entry: {
    app: ['./src/client/index.js'],
  },
  module: {
    loaders: [
      {test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader'},
    ],
  },
  output: {
    path: './build',
    publicPath: '/',
    filename: '[name].js',
  },
};
