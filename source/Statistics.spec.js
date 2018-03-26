
import Statistics from './Statistics';

describe('Statistics' , () => {

    describe('total visits', () => {

      it('count', () => {
        let visits = [];
        let stats = new Statistics(visits);
        visits.push('a');
        visits.push('a');
        visits.push('a');
        visits.push('a');
        let count = stats.totalVisits();
      });
    });
});