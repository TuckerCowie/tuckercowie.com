var express = require('express');
var sassMiddleware = require('node-sass-middleware');

var server = express();

server.set('view engine', 'pug');
server.set('views', './views');

server.use('/', sassMiddleware({
  src: __dirname,
  dest: __dirname + '/public',
  indentedSyntax: true,
  debug: process.env.node_env !== 'production',
  outputStyle: 'compressed',
}));
server.use('/', express.static(process.cwd() + '/public'));

server.get('*', function (req, res) {
  return res.render('index');
});

server.listen(process.env.PORT || 9000, () => {
  console.log('Server listening on port ' + (process.env.PORT || '9000'));
});
