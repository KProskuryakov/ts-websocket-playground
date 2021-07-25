import express from 'express';
import path from 'path';
import http from 'http';
import helmet from 'helmet';
import WebSocket from 'ws';
import { connect } from './Connections';

const port = process.env.PORT || 8080;

const app = express();

// disable CSP if not in production for livereload to work
if (process.env.NODE_ENV === "development") {
  console.log("Starting server in development mode.");
  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          defaultSrc: ['self', 'localhost:*', "ws://localhost:*"],
          scriptSrc: ['self', 'localhost:*', "ws://localhost:*"]
        }
      }
    })
  );
} else {
  console.log("Starting server in production mode. Enabling CSP.");
  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          defaultSrc: ['self', "wss://saunterdev.herokuapp.com:*"],
        }
      }
    })
  );
}

app.use(express.static(path.join(__dirname, '../../public')));
console.log(__dirname);

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on('connection', connect);

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
