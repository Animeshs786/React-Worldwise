// api/fakeApi.js

const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('data/cities.json');
const middlewares = jsonServer.defaults({ delay: 500 });

server.use(middlewares);
server.use((req, res, next) => {
  res.header('Content-Type', 'application/javascript');
  next();
});
server.use(router);

module.exports = server;
