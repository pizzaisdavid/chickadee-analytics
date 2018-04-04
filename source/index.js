
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
  [RESOURCES.RECENT_CHECKINS]: {
    duration: DURATIONS.HOUR,
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
});


app.get('/api/visits/summary', (req, res) => {
  res.json(statistics.computeVisitsForPopulation(DURATIONS.HOUR, DURATIONS.MINUTE));
});

app.get('/api/birds/:id/feeders', (req, res) => {
  res.json(statistics.getBirdsFeederVisits(req.params.id));
});

app.get('/api/birds/:id/movements', (req, res) => {
  res.json(statistics.computeIndividualBirdMovements(req.params.id));
});

app.get('/api/feeders/checkins', (req, res) => {
  res.json(statistics.getFeederCheckins(DURATIONS.HOUR));
});

app.listen(port, () => {
  console.log(`Analytics running on ${port}`);
});
