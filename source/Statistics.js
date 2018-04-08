
import _ from './birddash';

import { RESOUCE } from './constants';

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

  computeVisitsForPopulation(duration, step) {
    const now = this.clock.timestamp;
    const oldestUnixTimestampAllowed = this.computeOldestAllowedTimestamp(duration);
    const group = this.generateTimeSlots(oldestUnixTimestampAllowed, now, step);
    const ye = _(this.visits)
      .filterByTimestampsOlderThan(oldestUnixTimestampAllowed)
      .countByTimestampStep(step)
      .value();
    return _.merge(group, ye);
  }

  computeGOUP(timestamp, step) {
    return Math.floor(timestamp / step) * step;
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

  computeMovementsForIndividual(id, duration) {
    let location = undefined;

    const movements = {};
    const selectedVisits = _(this.visits)
      .filterByBird(id)
      .filterByTimestampsOlderThan(this.computeOldestAllowedTimestamp(duration))
      .value();

    _.each(selectedVisits, (visit) => {
      const bird = visit.bird;
      if (!location) {
        location = visit.feeder;
      } else if (location === visit.feeder) {
        // do nothing
      } else {
        let start = location;
        let end = visit.feeder;
        let path = [start, end];
        let count = _.get(movements, path, 0);
        count++;
        _.set(movements, path, count);

        path = [end, start];
        count = _.get(movements, path, 0);
        count++;
        _.set(movements, path, count);

        location = visit.feeder;
      }
    });
    return movements;
  }

  computeVisitsByFeederForIndividual(bird, duration) {
    return _(this.visits)
      .filterByBird(bird)
      .filterByTimestampsOlderThan(this.computeOldestAllowedTimestamp(duration))
      .countByFeeder()
      .value();
  }

  computeVisitsByFeederForPopulation(duration) {
    return _(this.visits)
      .filterByTimestampsOlderThan(this.computeOldestAllowedTimestamp(duration))
      .countByFeeder()
      .value();
  }

  computeOldestAllowedTimestamp(duration) {
    const EXCLUSIVE_INCLUDE = 1;
    return this.clock.timestamp - duration + EXCLUSIVE_INCLUDE;
  }

  computeTotalVisitsForPopulation(duration) {
    return _(this.visits)
      .filterByTimestampsOlderThan(this.computeOldestAllowedTimestamp(duration))
      .size();
  }

  computeAssociationsForPopulation(timespan) {
    return _.symmetric(_.zipObject(
      this.birds,
      _.map(this.birds, (bird) => this.computeForwardAssociationsForIndividual(bird, timespan))
    ));
  }

  computeForwardAssociationsForIndividual(bird, timespan) {
    return _(this.visits)
      .filterForwardAssociations(bird, timespan)
      .countByBird()
      .value();
  }

  computeMostActiveBirds(duration, limit) {
    // TODO: use duration
    const x = _(this.visits)
      .countByBird()
      .map((value, key) => {
        return { id: key, count: value }
      })
      .sortBy(['count'])
      .reverse()
      .slice(0, limit)
      .value()

    console.log(x);
    return x;
  }
}
