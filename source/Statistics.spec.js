
import Statistics from './Statistics';
import assert from 'assert';

describe('Statistics' , () => {

    describe('total visits', () => {

      it('count', () => {
        let visits = [];
        let stats = new Statistics();
        stats.addVisit('a');
        stats.addVisit('a');
        stats.addVisit('a');
        let count = stats.get('TOTAL_VISITS');
        assert.equal(count, 3);
      });
    });
});