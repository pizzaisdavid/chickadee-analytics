
import { RESOURCES, Statistics } from './Statistics';
import assert from 'assert';

describe('Statistics' , () => {
  let feeders;
  let birds;
  let visits;
  let clock;
  let stats;
  let config;

  beforeEach(() => {
    feeders = [
      {
        id: 'A',
        longitude: 0,
        latitude: 0,
      }, {
        id: 'B',
        longitude: 0,
        latitude: 0,
      }
    ];
    birds = [
      {
        rfid: 'a',
      }, {
        rfid: 'b',
      }, {
        rfid: 'c',
      },
    ];
    visits = [
      {
        visitTimestamp: 0,
        feederID: 'A',
        rfid: 'a'
      }, {
        visitTimestamp: 10,
        feederID: 'B',
        rfid: 'c'
      }, {
        visitTimestamp: 20,
        feederID: 'A',
        rfid: 'b'
      },
    ];
    clock = { time: 25 };
    config = {
      [RESOURCES.VISITS_HEATMAP]: {
        duration: 10,
      },
      [RESOURCES.RECENT_VISITS_BY_MINUTE]: {
        duration: 5,
        grouping: 1,
      },
    };
    stats = new Statistics(config, clock);
  });

  describe('total visits ever', () => {

    it('count', () => {
      stats.addVisits(visits);
      assert.deepEqual(stats.getTotalVisits(), 3);
    });
  });

  describe('heatmap', () => {

    it('old visits should not count', () => {
      stats.addVisits(visits);
      assert.deepEqual(stats.getHeatmap(), {
        A: 1,
      });
    });

    it('old visits should not count', () => {
      visits.push({
        visitTimestamp: 25,
        feederID: 'B',
        rfid: 'c'
      }, {
        visitTimestamp: 20,
        feederID: 'A',
        rfid: 'a'
      });
      stats.addVisits(visits);
      assert.deepEqual(stats.getHeatmap(), {
        A: 2,
        B: 1,
      });
    });
  });

  describe('recent visit count by timestamp', () => {

    it('empty', () => {
      stats.addVisits([]);
      assert.deepEqual(stats.getRecentVisitsByMinute(), {
        24: 0,
        23: 0,
        22: 0,
        21: 0,
        20: 0,
      });
    });

    it('increment', () => {
      stats.addVisits(visits);
      assert.deepEqual(stats.getRecentVisitsByMinute(), {
        24: 0,
        23: 0,
        22: 0,
        21: 0,
        20: 1,
      });
    });

    it('increment', () => {
      config[RESOURCES.RECENT_VISITS_BY_MINUTE] = {
        duration: 25,
        grouping: 25
      }
      stats.addVisits(visits);
      assert.deepEqual(stats.getRecentVisitsByMinute(), {
        25: 2,
        0: 1,
      });
    });
  });

  describe('each birds feeder visits', () => {

    it('no visits', () => {
      stats.addFeeders(feeders);
      stats.addBirds(birds);
      stats.addVisits([]);
      assert.deepEqual(stats.getEachBirdsFeederVisits(), {
        a: { A: 0, B: 0 },
        b: { A: 0, B: 0 },
        c: { A: 0, B: 0 },
      });
    });
  });
});