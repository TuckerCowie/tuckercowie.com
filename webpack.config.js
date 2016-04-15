module.exports = {
  cache: process.env.NODE_ENV === 'production',
  debug: process.env.NODE_ENV !== 'production',
  entry: {
    app: ['./public/index.js'],
  },
  module: {
    loaders: [
      {test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader'},
    ],
  },
  output: {
    path: './public',
    publicPath: '/',
    filename: 'bundle.js',
  },
};
