
import _ from './birddash';

export const RESOURCES = {
  RECENT_VISITS_SUMMARY: 'RECENT_VISITS_SUMMARY',
  RECENT_CHECKINS: 'RECENT_CHECKINS',
  ASSOCIATIONS: 'ASSOCIATIONS',
};

export const DURATIONS = {
  MINUTE: 60,
  HOUR: 60 * 60,
  DAY: 60 * 60 * 24,
  WEEK: 60 * 60 * 24 * 7,
  MONTH: 60 * 60 * 24 * 30,
  YEAR: 60 * 60 * 24 * 365,
  LIFETIME: Infinity,
};

export class Statistics {

  constructor(clock) {
    this.birds = [];
    this.feeders = [];
    this.visits = [];
    this.clock = clock;
  }

  add(name, list) {
    if (name === 'FEEDERS') {
      this.addFeeders(list);
    } else if (name === 'BIRDS') {
      this.addBirds(list);
    } else if (name === 'VISITS') {
      this.addVisits(list);
    }
  }

  addBirds(birds) {
    this.birds = _.uniq(this.birds.concat(birds));
  }

  addFeeders(feeders) {
    this.feeders = _.uniq(this.feeders.concat(feeders));
  }

  addVisits(visits) {
    this.visits = this.visits.concat(visits);
    this.visits.sort((a, b) => {
      return a.timestamp - b.timestamp;
    });
  }

  getTotalVisits() {
    return this.visits.length;
  }

  filterVisitsById(visits, id) {
    return _.filter(visits, (visit) => visit.birdId === id);
  }

  computeVisitsForPopulation(duration, step) {
    const now = this.clock.timestamp;
    const oldestUnixTimestampAllowed = this.computeOldestAllowedTimestamp(duration);

    const group = this.generateTimeSlots(oldestUnixTimestampAllowed, now, step);
    const selectedVisits = this.filterVisitsByTimestamp(this.visits, oldestUnixTimestampAllowed);

    const ye = _.countBy(selectedVisits, (visit) => this.computeGOUP(visit.timestamp, step));
    return _.merge(group, ye);
  }

  computeOldestAllowedTimestamp(duration) {
    const EXCLUSIVE_INCLUDE = 1;
    return this.clock.timestamp - duration + EXCLUSIVE_INCLUDE;
  }

  computeGOUP(timestamp, step) {
    return Math.floor(timestamp / step) * step;
  }

  filterVisitsByTimestamp(visits, limitTimestamp) {
    return _.filter(visits, (visit) => visit.timestamp >= limitTimestamp);
  }

  generateTimeSlots(start, stop, step) {
    const timestamps = _.range(start, stop);
    const slots = {};
    _.each(timestamps, (t) => {
      const x = this.computeGOUP(t, step);
      slots[x] = 0;
    });
    return slots;
  }

  computeMovementsForIndividual(id) {
    const locations = _.zero(this.birds);

    const movements = {};
    const selectedVisits = this.filterVisitsById(this.visits, id);

    _.each(selectedVisits, (visit) => {
      const bird = visit.birdId;
      if (!locations[bird]) {
        locations[bird] = visit.feederId;
      } else if (locations[bird] === visit.feederId) {
        // do nothing
      } else {
        let start = locations[bird];
        let end = visit.feederId;
        let path = [start, end];
        let count = _.get(movements, path, 0);
        count++;
        _.set(movements, path, count);

        path = [end, start];
        count = _.get(movements, path, 0);
        count++;
        _.set(movements, path, count);

        locations[bird] = visit.feederId;
      }
    });
    return movements;
  }

  computeVisitsByFeederForIndividual(id) {
    return _(this.visits)
      .filterByBird(id)
      .countByFeeder()
      .value();
  }

  computeVisitsByFeederForPopulation(duration) {
    // todo: remove the zeroing out
    const x = _.zero(this.feeders);
    const borks = _(this.visits)
      .filterByTimestampsOlderThan(this.computeOldestAllowedTimestamp(duration))
      .countByFeeder()
      .value();
    return _.merge(x, borks);
  }
}
