
import b_ from './birddash';

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
    this.birds = b_.uniq(this.birds.concat(birds));
  }

  addFeeders(feeders) {
    this.feeders = b_.uniq(this.feeders.concat(feeders));
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
    const zeroedOutTimeSlots = this.generateTimeSlots(oldestUnixTimestampAllowed, now, step);
    const actualGroupedVisitCount = b_(this.visits)
      .filterByTimestampsOlderThan(oldestUnixTimestampAllowed)
      .countByTimestampStep(step)
      .value();
    return b_.merge(zeroedOutTimeSlots, actualGroupedVisitCount);
  }

  generateTimeSlots(start, stop, step) {
    const timestamps = b_.range(start, stop);
    const slots = {};
    b_.each(timestamps, (t) => {
      const x = this.computeTimeSlot(t, step);
      slots[x] = 0;
    });
    return slots;
  }

  computeTimeSlot(timestamp, step) {
    return Math.floor(timestamp / step) * step;
  }

  computeMovementsForIndividual(id, duration) {
    return b_(this.visits)
      .filterByBird(id)
      .filterByTimestampsOlderThan(this.computeOldestAllowedTimestamp(duration))
      .computeMovements()
      .symmetric()
      .value();
  }

  computeVisitsByFeederForIndividual(bird, duration) {
    return b_(this.visits)
      .filterByBird(bird)
      .filterByTimestampsOlderThan(this.computeOldestAllowedTimestamp(duration))
      .countByFeeder()
      .value();
  }

  computeVisitsByFeederForPopulation(duration) {
    return b_(this.visits)
      .filterByTimestampsOlderThan(this.computeOldestAllowedTimestamp(duration))
      .countByFeeder()
      .value();
  }

  computeOldestAllowedTimestamp(duration) {
    const EXCLUSIVE_INCLUDE = 1;
    return this.clock.timestamp - duration + EXCLUSIVE_INCLUDE;
  }

  computeTotalVisitsForPopulation(duration) {
    return b_(this.visits)
      .filterByTimestampsOlderThan(this.computeOldestAllowedTimestamp(duration))
      .size();
  }

  computeAssociationsForPopulation(timespan) {
    return b_.symmetric(b_.zipObject(
      this.birds,
      b_.map(this.birds, (bird) => this.computeForwardAssociationsForIndividual(bird, timespan))
    ));
  }

  computeForwardAssociationsForIndividual(bird, timespan) {
    return b_(this.visits)
      .filterForwardAssociations(bird, timespan)
      .countByBird()
      .value();
  }

  computeMostActiveBirds(duration, limit) {
    return b_(this.visits)
      .filterByTimestampsOlderThan(this.computeOldestAllowedTimestamp(duration))
      .countByBird()
      .map((value, key) => {
        return { id: key, count: value }
      })
      .sortBy(['count'])
      .reverse()
      .slice(0, limit)
      .value();
  }
}
