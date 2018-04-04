
import * as _ from 'lodash';

export const RESOURCES = {
  RECENT_VISITS_SUMMARY: 'RECENT_VISITS_SUMMARY',
  RECENT_CHECKINS: 'RECENT_CHECKINS',
};

export const DURATIONS = {
  HOUR: 60 * 60,
  MINUTE: 60,
}

export class Statistics {

  constructor(config, clock) {
    this.birds = {};
    this.feeders = {};
    this.visits = [];
    this.config = config;
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
    this.birds = _.merge(this.birds, birds);
  }

  addFeeders(feeders) {
    this.feeders = _.merge(this.feeders, feeders);
  }

  addVisits(visits) {
    // is there a better way?
    this.visits = this.visits.concat(visits);
    this.visits.sort((a, b) => {
      return a.timestamp - b.timestamp;
    });
  }

  getTotalVisits() {
    return this.visits.length;
  }

  computeVisitsForPopulation(duration, step) {
    const now = this.clock.timestamp;
    const oldestUnixTimestampAllowed = now - duration + 1;

    const group = this.generateTimeSlots(oldestUnixTimestampAllowed, now, step);
    const selectedVisits = this.filterVisitsByTimestamp(this.visits, oldestUnixTimestampAllowed);

    const ye = _.countBy(selectedVisits, (visit) => this.computeGOUP(visit, step));
    return _.merge(group, ye);
  }

  computeGOUP(visit, step) {
    return Math.floor(visit.timestamp / step) * step;
  }

  filterVisitsByTimestamp(visits, limitTimestamp) {
    return _.filter(visits, (visit) => visit.timestamp >= limitTimestamp);
  }

  filterVisitsById(visits, id) {
    return _.filter(this.visits, (visit) => visit.birdId === id);
  }

  generateTimeSlots(start, stop, step) {
    const timestamps = _.range(start, stop);
    const slots = {};
    _.each(timestamps, (t) => {
      const x = Math.floor(t / step) * step;
      slots[x] = 0;
    });
    return slots;
  }

  computeVisitsByFeederForIndividual(id) {
    const selectedVisits = this.filterVisitsById(this.visits, id);
    return _.countBy(selectedVisits, 'feederId');
  }

  comptueMovementsForIndividual(id) {
    const locations = {};
    _.each(this.birds, (bird, id) => {
      locations[id] = undefined;
    });

    const movements = {};
    const selectedVisits = this.filterVisitsById(this.visits, id);

    _.each(selectedVisits, (visit) => {
      const bird = visit.birdId;
      if (locations[bird] === undefined) {
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

  getFeederCheckins() {
    const now = this.clock.timestamp;
    const duration = this.config[RESOURCES.RECENT_CHECKINS].duration;
    const oldestUnixTimestampAllowed = now - duration + 1;

    const selectedVisits = this.filterVisitsByTimestamp(this.visits, oldestUnixTimestampAllowed);

    const checkins = {};
    _.each(this.feeders, (value, id) => {
      checkins[id] = 0;
    });

    _.each(selectedVisits, (visit) => {
      checkins[visit.feederId]++;
    });

    return checkins;
  }
}
