
import { EventEmitter } from 'events';

export const RESOURCES = {
  TOTAL_VISITS: 'TOTAL_VISITS',
}

export default class Statistics extends EventEmitter {

  constructor() {
    super();
    this.visits = [];
  }

  addVisit(visit) {
    this.visits.push(visit);
    this.emit('change', RESOURCES.TOTAL_VISITS);
  }

  get(name) {
    if (name === RESOURCES.TOTAL_VISITS) {
      return this.visits.length;
    }
  }
}
