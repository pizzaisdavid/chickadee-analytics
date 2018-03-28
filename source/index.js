
import * as _ from 'lodash';
import express from 'express';

import Api from './Api';
import { Clock } from './Clock';
import { RESOURCES, Statistics } from './Statistics';

const app = express();

const port = 18156;
const clock = new Clock();
const statistics = new Statistics({
  [RESOURCES.VISITS_HEATMAP]: {
    duration: 100000,
  },
  [RESOURCES.RECENT_VISITS_BY_MINUTE]: {
    duration: 60 * 60,
    grouping: 60,
  },
}, clock);
const api = new Api();

api.on(Api.EVENTS.INITIALIZE, () => {
  console.log('initialize');
});

api.on(Api.EVENTS.NEW, (name, list) => {
  console.log(`new ${name}`);
  statistics.add(name, list);
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
    [RESOURCES.TOTAL_VISITS]: statistics.getTotalVisits(),
    [RESOURCES.VISITS_HEATMAP]: statistics.getHeatmap(),
    [RESOURCES.RECENT_VISITS_BY_MINUTE]: statistics.getRecentVisitsByMinute(),
  });
  res.end();
});

app.get('/api/stuff', (req, res) => {
  res.json({
    [Api.RESOURCES.FEEDERS]: statistics.feeders,
    [Api.RESOURCES.BIRDS]: statistics.birds,
    [Api.RESOURCES.VISITS]: statistics.visits.length,
  });
  res.end();
});

app.get('/api/total', (req, res) => {
  res.json({ 'visits' : statistics.getTotalVisits() });
});

app.listen(port, () => {
  console.log(`Analytics running on ${port}`);
});
