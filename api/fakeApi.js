const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("data/cities.json");
const middlewares = jsonServer.defaults({ delay: 500 });

server.use(middlewares);
server.use(router);

module.exports = server;
