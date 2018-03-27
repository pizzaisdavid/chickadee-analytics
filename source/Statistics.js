
import * as _ from 'lodash';

export const RESOURCES = {
  TOTAL_VISITS: 'TOTAL_VISITS',
  VISITS_MINUTE: 'VISITS_MINUTE',
  VISITS_HEATMAP: 'VISITS_HEATMAP',
};

export class Statistics {

  constructor(config, clock) {
    this.visits = {};
    this.config = config;
    this.clock = clock;
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
}
