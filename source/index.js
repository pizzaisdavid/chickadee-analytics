
import Api from './Api';

import express from 'express';
import http from 'http';
import socket from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = socket(server);

const port = 3000;
const api = new Api();
let total;
const snapshots = {};

api.on('initialize', () => {
  console.log('init');
  total = 0;
});

api.on('visit', (visit) => {
  let timestamp = visit.visitTimestamp;
  const slot = determineIncrement(timestamp);
  if (snapshots[slot] === undefined) {
    snapshots[slot] = 0;
  }
  snapshots[slot]++;
  total++;
});

function determineIncrement(n) {
  return Math.floor(n / 3600);
}

io.on('connection', (socket) => {
  console.log('test!');

  api.on('visit', () => { // literally emits per visit
    socket.emit('total', total);
  });

  socket.emit('total', total);
});

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8082');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.get('/health', (req, res) => {
  res.json({ status: 'good' });
  console.log(snapshots);
  console.log(Object.keys(snapshots).length);
  res.end();
});

console.log(`port ${port}`);
server.listen(port);
