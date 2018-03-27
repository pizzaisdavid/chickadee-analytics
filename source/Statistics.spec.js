
import { RESOURCES, Statistics } from './Statistics';
import assert from 'assert';

describe('Statistics' , () => {
  let visits;
  let clock;
  let stats;

  beforeEach(() => {
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
    stats = new Statistics({
      [RESOURCES.VISITS_HEATMAP]: {
        duration: 10,
      }
    }, clock);
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
      });
      visits.push({
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
});