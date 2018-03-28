
import * as _ from 'lodash';

export const RESOURCES = {
  TOTAL_VISITS: 'TOTAL_VISITS',
  VISITS_MINUTE: 'VISITS_MINUTE',
  VISITS_HEATMAP: 'VISITS_HEATMAP',
  RECENT_VISITS_BY_MINUTE: 'RECENT_VISITS_BY_MINUTE',
};

export class Statistics {

  constructor(config, clock) {
    this.feeders = {};
    this.birds = {};
    this.visits = {};
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
    _.each(birds, (b) => {
      const id = b.rfid;
      this.birds[id] = {
        feeders: {}, // TODO add current feeders!
      };
    });
  }

  addFeeders(feeders) {
    _.each(feeders, (f) => {
      const id = f.id;
      this.feeders[id] = {
        longitude: f.longitude,
        latitude: f.latitude,
      };
    });
  }

  addVisits(visits) {
    _.each(visits, (v) => {
      let i = v.visitTimestamp;
      v = _.omit(v, 'visitTimestamp');
      let x = _.get(this.visits, i, []);
      x.push(v);
      this.visits[i] = x;
    });
  }

  getTotalVisits() {
    return _.sum(_.map(this.visits, 'length'));
  }

  getHeatmap() {
    const now = this.clock.time;
    const duration = this.config[RESOURCES.VISITS_HEATMAP].duration;
    const oldestUnixTimestampAllowed = now - duration;
    const recentVisits = _.flatten(_.values(_.pickBy(this.visits, (visits, timestamp) => {
      return timestamp >= oldestUnixTimestampAllowed;
    })));
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
    const vs = _.pickBy(this.visits, (value, key) => {
      return key >= oldestUnixTimestampAllowed;
    });
    _.each(vs, (value, key) => {
      const d = Math.ceil(key / grouping) * grouping;
      group[d] += value.length;
    });
    return group;
  }

  getEachBirdsFeederVisits() {
    const x = {};

    _.each(this.birds, (value, rfid) => {
      x[rfid] = {};
      _.each(this.feeders, (v, id) => {
        x[rfid][id] = 0;
      });
    });

    return x;
  }
}
