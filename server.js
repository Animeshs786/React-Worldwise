// JSON Server module
import jsonServer from 'json-server';
import express from 'express'; // Import express
import path from 'path';

const server = express(); // Use express instead of jsonServer.create()
const router = jsonServer.router("data/cities.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Add custom route here if needed
server.use(
  jsonServer.rewriter({
    "/api/*": "/$1",
  })
);

// Serve static files from the 'public' directory (place your index.html file here)
server.use(express.static(path.join(__dirname, 'public')));

// Handle API routes
server.use('/api', router);

// Catch-all route to serve index.html for other routes
server.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
