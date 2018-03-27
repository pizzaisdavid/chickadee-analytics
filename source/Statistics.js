
import { EventEmitter } from 'events';

export const RESOURCES = {
  TOTAL_VISITS: 'TOTAL_VISITS',
}

export class Statistics extends EventEmitter {

  constructor() {
    super();
    this.visits = [];
  }

  addVisits(visits) {
    this.visits.push(...visits);
    this.emit('change', RESOURCES.TOTAL_VISITS, this.visits.length);
    this.emit(RESOURCES.TOTAL_VISITS, this.visits.length);
  }
}
