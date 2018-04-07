
import { RESOURCE, DURATION } from './constants';

import Clock from './Clock';

export class Cache {

  static make(statistics, clock) {
    return new Cache({
      [RESOURCE.ASSOCIATIONS]: {
        compute: () => {
          return statistics.computeAssociationsForPopulation();
        },
        lifespan: DURATION.DAY,
        timestamp: -Infinity,
      },
    }, clock);
  }

  constructor(config, clock) {
    this.config = config;
    this.clock = clock;
    this.answers = {};
  }

  get(resourceName) {
    if (this.isAnswerOutOfDate(resourceName)) {
      this.refresh(resourceName);
    }
    return this.answers[resourceName];
  }

  isAnswerOutOfDate(resourceName) {
    const config = this.config[resourceName];
    return config.timestamp + config.lifespan < this.clock.timestamp;
  }

  refresh(resourceName) {
    const config = this.config[resourceName];
    this.answers[resourceName] = config.compute();
    this.config[resourceName]['timestamp'] = this.clock.timestamp;
  }
}