
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
const statistics = new Statistics(clock);
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

app.get('/api/visits/summary', (req, res) => {
  res.json(statistics.computeVisitsForPopulation(DURATIONS.HOUR, DURATIONS.MINUTE));
});

app.get('/api/feeders/checkins', (req, res) => {
  const timespan = getTimespan(req.query.timespan);
  res.json(statistics.computeVisitsByFeederForPopulation(timespan));
});

app.get('/api/birds/:id/feeders', (req, res) => {
  res.json(statistics.computeVisitsByFeederForIndividual(req.params.id));
});

app.get('/api/birds/:id/movements', (req, res) => {
  res.json(statistics.computeMovementsForIndividual(req.params.id));
});

function getTimespan(value) {
  switch (value) {
    case 'day':
      return DURATIONS.DAY;
    case 'week':
      return DURATIONS.WEEK;
    case 'month':
      return DURATIONS.MONTH;
    case 'year':
      return DURATIONS.YEAR;
    case 'all':
    default:
      return DURATIONS.LIFETIME;
  }
}

app.listen(port, () => {
  console.log(`Analytics running on ${port}`);
});
