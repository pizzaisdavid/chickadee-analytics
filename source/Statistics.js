
import _ from 'lodash';

function filterByBirdId(list, id) {
  return _.filter(list, (item) => item.birdId === id);
}

function filterByFeeder(list, id) {
  return _.filter(list, (item) => item.feederId === id);
}

function countByFeeder(visits) {
  return _.countBy(visits, 'feederId');
}

function groupByFeeder(visits) {
  return _.groupBy(visits, 'feederId');
}

function computeAssociations(birds, visits, timespan) {
  let timestamp = -Infinity;
  const associations = {};
  _(birds)
    .each((bird, id) => {
      let timestamp = -Infinity;
      let feeder = null;
      associations[id] = _(visits)
        .filter((visit) => {
          if (visit.birdId === bird.id) {
            feeder = visit.feederId;
            timestamp = visit.timestamp;
            return false;
          }
          if (feeder !== visit.feederId) {
            return false;
          }
          if (timestamp + timespan < visit.timestamp) {
            return false;
          }
          return true;
        })
        .countBy('birdId')
        .value();
    });
    return associations;
}

function zero(source) {
  const destination = {};
  _.each(source, (value, key) => {
    destination[key] = 0;
  });
  return destination;
}

function filterOldVisits(visits, limitTimestamp) {
  return _.filter(visits, (visit) => visit.timestamp >= limitTimestamp);
}

_.mixin({
  'filterByBirdId': filterByBirdId,
  'filterByFeeder': filterByFeeder,
  'groupByFeeder': groupByFeeder,
  'countByFeeder': countByFeeder,
  'zero': zero,
  'filterOldVisits': filterOldVisits,
  'computeAssociations': computeAssociations,
});

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
      .filterByBirdId(id)
      .countByFeeder()
      .value();
  }

  computeVisitsByFeederForPopulation(duration) {
    // todo: remove the zeroing out
    const x = _.zero(this.feeders);
    const borks = _(this.visits)
      .filterOldVisits(this.computeOldestAllowedTimestamp(duration))
      .countByFeeder()
      .value();
    return _.merge(x, borks);
  }

  computeAssociationsForPopulation(timespan) {    
    return this.makeSymetric(_(this.birds)
      .computeAssociations(this.visits, timespan)
      .value());
  }

  makeSymetric(matrix) {
    const newm = {};
    _.each(matrix, (row, key1) => {
      _.each(row, (value, key2) => {
        let v1 = 0;
        let v2 = 0;
        try {
          v1 = matrix[key1][key2];
        } catch (e) {
        }
        try {
          v2 = matrix[key2][key1];
        } catch (e) {
        }
        const total = v1 + v2;
        _.set(newm, [key1, key2], total);
        _.set(newm, [key2, key1], total);
      })
    });
    return newm;
  }

  findAssociatedBirds(limitTimestamp, id, feeder, index) {
    const visits = [];
    _(this.visits)
      .slice(index + 1)
      .each((visit) => {
        if (visit.timestamp > limitTimestamp) {
          return false;
        }
        if (visit.birdId === id) {
          return false;
        }
        if (visit.feederId === feeder) {
          visits.push(visit);
        }
      });
  return visits;
  }
}
