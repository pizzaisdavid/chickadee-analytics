
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
  socket.emit('total', getTotal(snapshots));

  api.on('visit', () => {
    // emits per visit to each socket
    // if anyone is on the website when this starts up, their webpage shits the bed
    socket.emit('total', getTotal(snapshots));
  });
});

function getTotal(snaps) {
  const totals = _.map(snaps, (s) => {
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
  console.log(snapshots);
  console.log(Object.keys(snapshots).length);
  console.log(getTotal(snapshots));
  res.end();
});

console.log(`port ${port}`);
server.listen(port);
