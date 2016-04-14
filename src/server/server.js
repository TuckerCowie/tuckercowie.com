import express from 'express';

const server = express();

server.set('view engine', 'jade');
server.set('views', './src/server/views');

server.use(express.static(`${process.cwd()}/build`));

server.get('*', (req, res) => {
  res.render('index');
});

server.listen(process.env.PORT || 9000, () => {
  console.log(`Server listening on port ${process.env.PORT || '9000'}`);
});
