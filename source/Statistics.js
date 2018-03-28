
import * as _ from 'lodash';

export const RESOURCES = {
  TOTAL_VISITS: 'TOTAL_VISITS',
  VISITS_MINUTE: 'VISITS_MINUTE',
  VISITS_HEATMAP: 'VISITS_HEATMAP',
  RECENT_VISITS_BY_MINUTE: 'RECENT_VISITS_BY_MINUTE',
};

export class Statistics {

  constructor(config, clock) {
    this.feeders = [];
    this.birds = [];
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
    this.birds.push(...birds);
  }

  addFeeders(feeders) {
    this.feeders.push(...feeders);
  }

  addVisits(visits) {
    this.visits.push(...visits);
  }

  getTotalVisits() {
    return this.visits.length;
  }

  getHeatmap() {
    const now = this.clock.time;
    const duration = this.config[RESOURCES.VISITS_HEATMAP].duration;
    const oldestUnixTimestampAllowed = now - duration;

    const recentVisits = _.filter(this.visits, (visit) => {
      return visit.visitTimestamp >= oldestUnixTimestampAllowed;
    });
    const counts = _.countBy(recentVisits, 'feederID');
    return counts;
  }

  getRecentVisitsByMinute() {
    const now = this.clock.time;
    const duration = this.config[RESOURCES.RECENT_VISITS_BY_MINUTE].duration;
    const grouping = this.config[RESOURCES.RECENT_VISITS_BY_MINUTE].grouping;
    const oldestUnixTimestampAllowed = now - duration;
    const times = _.range(oldestUnixTimestampAllowed, now);
    const group = {};
    _.each(times, (t) => {
      const d = Math.ceil(t / grouping) * grouping;
      group[d] = 0;
    });

    const recentVisits = _.filter(this.visits, (visit) => {
      return visit.visitTimestamp >= oldestUnixTimestampAllowed;
    });

    _.each(recentVisits, (visit) => {
      const timestamp = visit.visitTimestamp;
      const d = Math.ceil(timestamp / grouping) * grouping;
      group[d]++;
    });
    return group;
  }

  getEachBirdsFeederVisits() {
    const x = {};

    _.each(this.birds, (bird) => {
      x[bird.rfid] = {};
      _.each(this.feeders, (feeder) => {
        x[bird.rfid][feeder.id] = 0;
      });
    });

    _.each(this.visits, (visit) => {
      x[visit.rfid][visit.feederID]++;
    });

    return x;
  }
}
