
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

    it('count', (done) => {
      stats.on(RESOURCES.TOTAL_VISITS, (value) => {
        assert.deepEqual(value, 3);
        done();
      });
      stats.addVisits(visits);
    });
  });

  describe('heatmap', () => {

    it('old visits should not count', (done) => {
      stats.on(RESOURCES.VISITS_HEATMAP, (data) => {
        assert.deepEqual(data, {
          A: 1,
        });
        done();
      });
      stats.addVisits(visits);
    });
  });
});