
import Api from './Api';

import * as _ from 'lodash';
import express from 'express';
import http from 'http';
import socket from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = socket(server);

const port = 3000;
const api = new Api();
const snapshots = {};

api.on('initialize', () => {
  console.log('initialize');
});

api.on('visit', (visit) => {
  const slot = determineIncrement(visit.visitTimestamp);
  if (snapshots[slot] === undefined) {
    snapshots[slot] = {
      total: 0,
    };
  }
  snapshots[slot].total++;
});

function determineIncrement(n) {
  return Math.floor(n / 3600);
}

io.on('connection', (socket) => {
  console.log('connection');

  socket.frame = 'NOW';
  init(socket);

  socket.on('frame', (timestamp) => {
    socket.frame = determineIncrement(timestamp);
    init(socket);
  });

  function init(socket) {
    socket.emit('total', getTotal(snapshots, socket.frame));
  }

  api.on('visit', () => {
    // emits per visit to each socket
    // if anyone is on the website when this starts up, their webpage shits the bed
    socket.emit('total', getTotal(snapshots));
  });
});

function getTotal(snaps, frame) {
  if (frame === 'NOW' || frame === undefined) {
    frame = determineIncrement(Date.now() / 1000);
  }
  let ss = _.pickBy(snaps, (value, key) => {
    return parseInt(key) <= frame;
  });
  const totals = _.map(ss, (s) => {
    return s.total;
  });
  return _.sum(totals);
}

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8082');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.get('/health', (req, res) => {
  res.json({ status: 'good' });
  res.end();
});

console.log(`port ${port}`);
server.listen(port);
