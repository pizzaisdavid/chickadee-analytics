
import * as _ from 'lodash';
import express from 'express';
import cors from 'cors';

import Api from './Api';
import { Clock } from './Clock';
import { RESOURCES, DURATIONS, Statistics } from './Statistics';

const app = express();

app.use(cors());

var whitelist = ['http://localhost:8082', 'http://euclid.nmu.edu']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

const port = 18156;
const clock = new Clock();
const statistics = new Statistics({
  [RESOURCES.VISITS_HEATMAP]: {
    duration: 100000,
  },
  [RESOURCES.RECENT_VISITS_SUMMARY]: {
    duration: DURATIONS.HOUR,
    grouping: DURATIONS.MINUTE,
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

app.get('/api/visits/total', (req, res) => {
  res.json({ 'visits' : statistics.getTotalVisits() });
});

app.get('/api/birds/:id/feeders', (req, res) => {
  res.json(statistics.getBirdsFeederVisits(req.params.id));
});

app.listen(port, () => {
  console.log(`Analytics running on ${port}`);
});
