
import _ from 'lodash';

function filterByBirdId(list, id) {
  return _.filter(list, (item) => item.birdId === id);
}

function groupByFeederId(visits) {
  return _.countBy(visits, 'feederId');
}

_.mixin({
  'filterByBirdId': filterByBirdId,
  'groupByFeederId': groupByFeederId
});

export const RESOURCES = {
  RECENT_VISITS_SUMMARY: 'RECENT_VISITS_SUMMARY',
  RECENT_CHECKINS: 'RECENT_CHECKINS',
};

export const DURATIONS = {
  HOUR: 60 * 60,
  MINUTE: 60,
}

export class Statistics {

  constructor(clock) {
    this.birds = {};
    this.feeders = {};
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

  filterVisitsById(visits, id) {
    return _.filter(visits, (visit) => visit.birdId === id);
  }

  computeVisitsForPopulation(duration, step) {
    const now = this.clock.timestamp;
    const oldestUnixTimestampAllowed = this.computeOldestAllowedTimestamp(duration);

    const group = this.generateTimeSlots(oldestUnixTimestampAllowed, now, step);
    const selectedVisits = this.filterVisitsByTimestamp(this.visits, oldestUnixTimestampAllowed);

    const ye = _.countBy(selectedVisits, (visit) => this.computeGOUP(visit, step));
    return _.merge(group, ye);
  }

  computeOldestAllowedTimestamp(duration) {
    const EXCLUSIVE_INCLUDE = 1;
    return this.clock.timestamp - duration + EXCLUSIVE_INCLUDE;
  }

  computeGOUP(visit, step) {
    return Math.floor(visit.timestamp / step) * step;
  }

  filterVisitsByTimestamp(visits, limitTimestamp) {
    return _.filter(visits, (visit) => visit.timestamp >= limitTimestamp);
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
    return _(this.visits)
      .filterByBirdId(id)
      .groupByFeederId()
      .value();
  }

  computeMovementsForIndividual(id) {
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

  computeVisitsByFeederForPopulation(duration) {
    const now = this.clock.timestamp;
    const oldestUnixTimestampAllowed = this.computeOldestAllowedTimestamp(duration);

    const selectedVisits = this.filterVisitsByTimestamp(this.visits, oldestUnixTimestampAllowed);

    const checkins = {};
    _.each(this.feeders, (value, id) => {
      checkins[id] = 0;
    });

    const x = _.countBy(selectedVisits, 'feederId');

    return _.merge(checkins, x);
  }
}
