
import { RESOURCES, Statistics } from './Statistics';
import assert from 'assert';

describe('Statistics' , () => {

    describe('total visits', () => {
      let visits;
      let stats;

      beforeEach(() => {
        visits = ['a', 'b', 'c'];
        stats = new Statistics();
      });

      it('count', (done) => {
        stats.on(RESOURCES.TOTAL_VISITS, (value) => {
          assert.equal(value, 3);
          done();
        });
        stats.addVisits(visits);
      });
    });
});