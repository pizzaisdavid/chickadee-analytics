
import * as _ from 'lodash';

export const RESOURCES = {
  TOTAL_VISITS: 'TOTAL_VISITS',
  VISITS_HEATMAP: 'VISITS_HEATMAP',
  RECENT_VISITS_SUMMARY: 'RECENT_VISITS_SUMMARY',
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

  getVisitsGroupedByTime() {
    const now = this.clock.timestamp;
    const duration = this.config[RESOURCES.RECENT_VISITS_SUMMARY].duration;
    const grouping = this.config[RESOURCES.RECENT_VISITS_SUMMARY].grouping;
    const oldestUnixTimestampAllowed = now - duration + 1;

    const group = this.generateTimeSlots(oldestUnixTimestampAllowed, now, grouping);
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

  generateTimeSlots(start, stop, step) {
    const timestamps = _.range(start, stop);
    const slots = {};
    _.each(timestamps, (t) => {
      const x = Math.floor(t / step) * step;
      slots[x] = 0;
    });
    return slots;
  }

  getBirdsFeederVisits(id) {
    const selectedVisits = _.filter(this.visits, (visit) => {
      return visit.birdId === id;
    });

    // use count by?
    const relation = {};
    _.each(selectedVisits, (visit) => {
      const id = visit.feederId;
      if (relation[id] === undefined) {
        relation[id] = 0;
      }
      relation[id]++;
    });

    return relation;
  }

  getBirdMovements(id) {

    const locations = {};
    _.each(this.birds, (bird) => {
      locations[bird.id] = undefined;
    });

    const movements = {};
    const selectedVisits = _.filter(this.visits, (v) => v.birdId === id);
    _.each(selectedVisits, (visit) => {
      const bird = visit.birdId;
      if (locations[bird] === undefined) {
        locations[bird] = visit.feederId;
      } else if (locations[bird] === visit.feederId) {
        // do nothing
      } else {
        let start = locations[bird];
        let end = visit.feederId;
        if (movements[start] === undefined) {
          movements[start] = {};
        }
        if (movements[start][end] === undefined) {
          movements[start][end] = 0;
        }
        movements[start][end]++;

        if (movements[end] === undefined) {
          movements[end] = {};
        }
        if (movements[end][start] === undefined) {
          movements[end][start] = 0;
        }
        movements[end][start]++;     
        locations[bird] = visit.feederId;
      }
    });
    return movements;
  }
}
