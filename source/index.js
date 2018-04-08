
import * as _ from 'lodash';
import express from 'express';
import cors from 'cors';

import Api from './Api';
import { Clock } from './Clock';
import { RESOURCE, DURATION } from './constants';
import { Statistics } from './Statistics';
import { Cache } from './Cache';

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
const statistics = new Statistics(clock);
const cache = Cache.make(statistics, clock);

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
});

app.get('/api/visits/summary', (req, res) => { // TODO: should remove 'summary' from url
  res.json(statistics.computeVisitsForPopulation(DURATION.HOUR, DURATION.MINUTE));
});

app.get('/api/visits/total', (req, res) => {
  const duration = getTimespan(req.query.duration);
  res.json(statistics.computeTotalVisitsForPopulation(duration));
});

app.get('/api/feeders/visits', (req, res) => {
  const duration = getTimespan(req.query.duration);
  res.json(statistics.computeVisitsByFeederForPopulation(duration));
});

app.get('/api/birds/leaderboard', (req, res) => {
  const duration = getTimespan(req.query.duration);
  const limit = parseLimit(req.query.limit);
  res.json(statistics.computeMostActiveBirds(duration, limit));
});

app.get('/api/birds/:id/feeders', (req, res) => {
  const duration = getTimespan(req.query.duration)
  res.json(statistics.computeVisitsByFeederForIndividual(req.params.id, duration));
});

app.get('/api/birds/:id/movements', (req, res) => {
  res.json(statistics.computeMovementsForIndividual(req.params.id));
});

app.get('/api/birds/associations', (req, res) => {
  res.json(cache.get(RESOURCE.ASSOCIATIONS));
});

app.get('/api/birds/:id/associations', (req, res) => {
  res.json(cache.get(RESOURCE.ASSOCIATIONS)[req.params.id]);
});

function parseLimit(value) {
  return value || Infinity;
}

function getTimespan(value) {
  switch (value) {
    case 'day':
      return DURATION.DAY;
    case 'week':
      return DURATION.WEEK;
    case 'month':
      return DURATION.MONTH;
    case 'year':
      return DURATION.YEAR;
    case 'all':
    default:
      return DURATION.LIFETIME;
  }
}

app.listen(port, () => {
  console.log(`Analytics running on ${port}`);
});
