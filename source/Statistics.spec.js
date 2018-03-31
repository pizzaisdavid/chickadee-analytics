
import * as _ from 'lodash';
import assert from 'assert';

import { Statistics } from './Statistics';
import datasets from './datasets';

describe('Statistics' , () => {

  describe('ALL LIFETIME: visit total', () => {
    _.map(datasets, (dataset) => {
      it(dataset.name, () => {
        const stats = new Statistics({}, dataset.clock);
        stats.addVisits(dataset.visits);
        assert.deepEqual(stats.getTotalVisits(), dataset.statistics.visits.total);
      });
    });
  });

  describe('ALL RECENT: visits over time', () => {
    _.map(datasets, (dataset) => {
      it(dataset.name, () => {
        const stats = new Statistics(dataset.config, dataset.clock);
        stats.addVisits(dataset.visits);
        assert.deepEqual(stats.getVisitsGroupedByTime(), dataset.statistics.visits.grouped);
      });
    });
  });
});