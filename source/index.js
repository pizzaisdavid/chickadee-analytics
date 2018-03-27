
import * as _ from 'lodash';
import express from 'express';
import http from 'http';

import Api from './Api';
import { Clock } from './Clock';
import { RESOURCES, Statistics } from './Statistics';

const app = express();

const port = 3000;
const clock = new Clock();
const statistics = new Statistics({
  [RESOURCES.VISITS_HEATMAP]: {
    duration: 3600,
  },
}, clock);
const api = new Api();

api.on('initialize', () => {
  console.log('initialize');
});

api.on('visits', (v) => {
  console.log('VISITS');
  statistics.addVisits(v);
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
  console.log(statistics.frequency);
  res.end();
});

app.listen(port, () => {
  console.log(`Analytics running on ${port}`);
});
