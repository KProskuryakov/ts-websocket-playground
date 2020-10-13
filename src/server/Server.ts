import express from 'express';
import path from 'path';
import http from 'http';
// import helmet from 'helmet';
import WebSocket from 'ws';

const port = 8080;

const app = express();
// app.use(helmet());
app.use(express.static(path.join(__dirname, '../../public')));
console.log(__dirname);

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

const activeSockets = new Set<WebSocket>()

wss.on('connection', function connection(ws) {
  activeSockets.add(ws);

  ws.on('message', function incoming(message) {
    console.log(`received: ${message}`);
    activeSockets.forEach(socket => {
      socket.send(message);
    });
  });

  ws.on('close', function closeSocket() {
    activeSockets.delete(this);
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
