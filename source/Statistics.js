
import { EventEmitter } from "events";

export default class Statistics extends EventEmitter {

  static get RESOURCES() {
    return [
      'TOTAL_VISITS',
    ];
  }

  constructor() {
    super();
    this.visits = [];
  }

  addVisit(visit) {
    this.visits.push(visit);
    this.emit('change', 'TOTAL_VISITS');
  }

  get(name) {
    if (name === 'TOTAL_VISITS') {
      return this.visits.length;
    }
  }
}
