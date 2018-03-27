
import * as _ from 'lodash';

import { EventEmitter } from 'events';

export const RESOURCES = {
  TOTAL_VISITS: 'TOTAL_VISITS',
  VISITS_MINUTE: 'VISITS_MINUTE',
  VISITS_HEATMAP: 'VISITS_HEATMAP',
};

export class Statistics extends EventEmitter {

  constructor(config, clock) {
    super();
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
    this.refresh([
      RESOURCES.TOTAL_VISITS,
      RESOURCES.VISITS_HEATMAP,
    ]);
    console.log(this.visits);
    this.length = _.map(this.visits, 'length').sum();
    this.frequency = this.heatmap();
    this.notify(RESOURCES.TOTAL_VISITS, this.length);
    this.notify(RESOURCES.VISITS_HEATMAP, this.frequency);
  }

  heatmap() {
    const now = this.clock.time;
    const duration = this.config[RESOURCES.VISITS_HEATMAP].duration;
    const oldestUnixTimestampAllowed = now - duration;
    const recentVisits = _.flatten(_.values(_.pickBy(this.visits, (visits, timestamp) => {
      return timestamp >= oldestUnixTimestampAllowed;
    })));
    console.log('recents');
    console.log(recentVisits);
    const counts = _.countBy(recentVisits, 'feederID');
    return counts;
  }

  refresh(names) {
    _.each(names, (name) => {

    });
  }

  notify(name, data) {
    this.emit('change', name, data);
    this.emit(name, data);
  }
}
