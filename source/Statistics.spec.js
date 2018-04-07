
import * as _ from 'lodash';
import assert from 'assert';

import { RESOURCE } from './constants';
import { Statistics } from './Statistics';
import {
  add,
  empty,
  single,
  simple,
  movement,
  movementUnordered,
  oneBirdManyFeeders,
  associationsEven,
  associationsNoContact,
  associations2,
  associationsDontDoubleCount,
} from './datasets';

describe('Statistics' , () => {

  describe('ADD', () => {
    _.each([
      add,
    ], (dataset) => {
      it(dataset.name, () => {
        const statistics = new Statistics(dataset.clock);
        statistics.addBirds(dataset.birds[0]);
        statistics.addBirds(dataset.birds[1]);
        statistics.addFeeders(dataset.feeders[0]);
        statistics.addFeeders(dataset.feeders[1]);
        assert.deepEqual(statistics.birds.length, dataset.statistics.birds.total);
        assert.deepEqual(statistics.feeders.length, dataset.statistics.feeders.total);
      });
    });
  });

  describe('POPULATION LIFETIME: visit total', () => {
    _.map([
      empty,
      single,
      simple,
    ], (dataset) => {
      testDatasetForPopulation(dataset, (statistics) => {
        assert.deepEqual(statistics.getTotalVisits(), dataset.statistics.visits.total);
      });
    });
  });

  describe('POPULATION RECENT: visits over time', () => {
    _.map([
      empty,
      single,
      simple,
    ], (dataset) => {
      testDatasetForPopulation(dataset, (statistics) => {
        const duration = dataset.config[RESOURCE.RECENT_VISITS_SUMMARY].duration;
        const grouping = dataset.config[RESOURCE.RECENT_VISITS_SUMMARY].grouping;
        const actual = statistics.computeVisitsForPopulation(duration, grouping);
        const expected = dataset.statistics.visits.grouped;
        assert.deepEqual(actual, expected);
      });
    });
  });

  describe('INDIVIDUAL LIFETIME: feeder checkins', () => {
    _.map([
      empty,
      single,
      simple,
    ], (dataset) => {
      testDatasetForIndividuals(dataset, (statistics, id) => {
        assert.deepEqual(statistics.computeVisitsByFeederForIndividual(id), dataset.statistics.birds.checkins[id]);
      });
    });
  });

  describe('INDIVIDUAL LIFETIME: movement', () => {
    _.map([
      empty,
      movement,
      movementUnordered,
      oneBirdManyFeeders,
    ], (dataset) => {
      testDatasetForIndividuals(dataset, (statistics, id) => {
        assert.deepEqual(statistics.computeMovementsForIndividual(id), dataset.statistics.birds.movements[id]);
      });
    });
  });

  describe('POPULATION RECENT: feeder checkins', () => {
    _.map([
      empty,
      single,
      simple,
      oneBirdManyFeeders,
    ], (dataset) => {
      testDatasetForPopulation(dataset, (statistics) => {
        const duration = dataset.config[RESOURCE.RECENT_CHECKINS].duration;
        assert.deepEqual(
          statistics.computeVisitsByFeederForPopulation(duration),
          dataset.statistics.feeders.checkins
        );
      });
    });
  });

  describe('POPULATION LIFETIME: associations', () => {
    _.map([
      empty,
      single,
      simple,
      associationsEven,
      associationsNoContact,
      associations2,
      associationsDontDoubleCount,
    ], (dataset) => {
      testDatasetForPopulation(dataset, (statistics) => {
        const timespan = dataset.config[RESOURCE.ASSOCIATIONS].timespan;
        assert.deepEqual(
          statistics.computeAssociationsForPopulation(timespan),
          dataset.statistics.birds.associations
        );
      });
    });
  });
});

function testDatasetForPopulation(dataset, callback) {
  it(dataset.name, () => {
    const statistics = new Statistics(dataset.clock);
    statistics.addBirds(dataset.birds);
    statistics.addFeeders(dataset.feeders);
    statistics.addVisits(dataset.visits);
    callback(statistics, dataset);
  });
}

function testDatasetForIndividuals(dataset, callback) {
  describe(dataset.name, () => {
    const statistics = new Statistics(dataset.clock);
    statistics.addBirds(dataset.birds);
    statistics.addFeeders(dataset.feeders);
    statistics.addVisits(dataset.visits);
    _.map(dataset.birds, (bird) => {
      it(bird, () => {
        callback(statistics, bird)
      });
    });
  });
}