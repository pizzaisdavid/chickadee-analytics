
import * as _ from 'lodash';

export const RESOURCES = {
  TOTAL_VISITS: 'TOTAL_VISITS',
  VISITS_HEATMAP: 'VISITS_HEATMAP',
  RECENT_VISITS_SUMMARY: 'RECENT_VISITS_SUMMARY',
  ASSOCIATIONS: 'ASSOCIATIONS',
};

export const DURATIONS = {
  HOUR: 60 * 60,
  MINUTE: 60,
}

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
    // is there a better way?
    this.visits = this.visits.concat(visits);
  }

  getTotalVisits() {
    return this.visits.length;
  }

  getVisitsGroupedByTime() {
    const now = this.clock.timestamp;
    const duration = this.config[RESOURCES.RECENT_VISITS_SUMMARY].duration;
    const grouping = this.config[RESOURCES.RECENT_VISITS_SUMMARY].grouping;
    const oldestUnixTimestampAllowed = now - duration;
    const times = _.range(oldestUnixTimestampAllowed + 1, now);
    const group = {};
    _.each(times, (t) => {
      const d = Math.floor(t / grouping) * grouping;
      group[d] = 0;
    });
    const recentVisits = _.filter(this.visits, (visit) => {
      return visit.timestamp >= oldestUnixTimestampAllowed;
    });

    _.each(recentVisits, (visit) => {
      const timestamp = visit.timestamp;
      const d = Math.floor(timestamp / grouping) * grouping;
      group[d]++;
    });
    return group;
  }

  getBirdsFeederVisits(id) {
    const selectedVisits = _.filter(this.visits, (visit) => {
      return visit.bird === id;
    });

    // use count by?
    const relation = {};
    _.each(selectedVisits, (visit) => {
      const id = visit.feeder;
      if (relation[id] === undefined) {
        relation[id] = 0;
      }
      relation[id]++;
    });

    return relation;
  }

  getAssociationsForBird(id) {
    const grouping = this.config[RESOURCES.ASSOCIATIONS].grouping;
    const associations = {};
    _.each(this.visits, (visit, index) => {
      if (visit.bird === id) {
        const filteredVisits = this.findGoodVisits(visit.timestamp, grouping, index, id);
        console.log(filteredVisits);
      }
    });
    return associations;
  }

  findGoodVisits(timestamp, limit, index, id) {
    const visits = [];
    return visits;
  }
}
