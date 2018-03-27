
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
    duration: 100000,
  },
  [RESOURCES.RECENT_VISITS_BY_MINUTE]: {
    duration: 60 * 60 * 24,
    grouping: 60,
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

app.get('/api/health', (req, res) => {
  res.json({ status: 'good' });
  res.end();
});

app.get('/api', (req, res) => {
  res.json({
    'TOTAL_VISITS' : statistics.getTotalVisits(),
    'VISITS_HEATMAP' : statistics.getHeatmap(),
    [RESOURCES.RECENT_VISITS_BY_MINUTE]: statistics.getRecentVisitsByMinute(),
  });
  res.end();
});

app.listen(port, () => {
  console.log(`Analytics running on ${port}`);
});
