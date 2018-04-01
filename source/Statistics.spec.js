
import * as _ from 'lodash';
import assert from 'assert';

import { Statistics } from './Statistics';
import datasets from './datasets';

describe('Statistics' , () => {

  describe('POPULATION LIFETIME: visit total', () => {
    _.map(datasets, (dataset) => {
      it(dataset.name, () => {
        const stats = new Statistics({}, dataset.clock);
        stats.addVisits(dataset.visits);
        assert.deepEqual(stats.getTotalVisits(), dataset.statistics.visits.total);
      });
    });
  });

  describe('POPULATION RECENT: visits over time', () => {
    _.map(datasets, (dataset) => {
      it(dataset.name, () => {
        const stats = new Statistics(dataset.config, dataset.clock);
        stats.addVisits(dataset.visits);
        assert.deepEqual(stats.getVisitsGroupedByTime(), dataset.statistics.visits.grouped);
      });
    });
  });

  describe('INDIVIDUAL LIFETIME: get feeder checkins', () => {
    _.map(datasets, (dataset) => {
      describe(dataset.name, () => {
        const stats = new Statistics(dataset.config, dataset.clock);
        stats.addBirds(dataset.birds);
        stats.addFeeders(dataset.feeders);
        stats.addVisits(dataset.visits);
        _.map(dataset.birds, (bird) => {
          const id = bird.id;
          it(id, () => {
            assert.deepEqual(stats.getBirdsFeederVisits(id), dataset.statistics.birds.checkins[id]);
          });
        });
      });
    });
  });

  describe('INDIVIDUAL LIFETIME: movement', () => {
    _.map(datasets, (dataset) => {
      describe(dataset.name, () => {
        const stats = new Statistics(dataset.config, dataset.clock);
        stats.addBirds(dataset.birds);
        stats.addFeeders(dataset.feeders);
        stats.addVisits(dataset.visits);
        _.map(dataset.birds, (bird) => {
          const id = bird.id;
          it(id, () => {
            assert.deepEqual(stats.getBirdMovements(id), dataset.statistics.birds.movements[id]);
          });
        });
      });
    });
  });
});