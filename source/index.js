
import * as _ from 'lodash';
import express from 'express';
import http from 'http';
import socket from 'socket.io';

import Api from './Api';
import Statistics from './Statistics';

const app = express();
const server = http.createServer(app);
const io = socket(server);

const port = 3000;
const statistics = new Statistics();
const api = new Api();

const subscriptions = {
  'TOTAL_VISITS': new Set(),
};

const cooldowns = {
  'TOTAL_VISITS': 5,
}

const pushTimestamps = {
  'TOTAL_VISITS': 0,
}

api.on('initialize', () => {
  console.log('initialize');
});

api.on('visit', (v) => {
  statistics.addVisit(v);
});

io.on('connection', (socket) => {
  console.log('connection');

  socket.on('subscribe', (name) => {
    subscriptions[name].add(socket);
    socket.emit(name, statistics.get(name));
  });

  socket.on('unsubscribe', (name) => {
    console.log(`someone unsubscribed from ${name}`);
    subscriptions[name].delete(socket);
  });

  socket.on('disconnect', () => {
    // TODO test this
    console.log('disconnect');
    _.each(subscriptions, (sockets, name) => {
      sockets.delete(socket);
    })
  });
});

api.on('visit', () => {
  const subscribers = subscriptions['TOTAL_VISITS'];
  const total = statistics.get('TOTAL_VISITS');
  _.each(subscribers, (socket) => {
    socket.emit(TOTAL_VISITS, total);
  });
});

function spamCheck(text) {
  const now = Date.now() / 1000;
  return pushTimestamps[text] + cooldowns[text] <= now;
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
