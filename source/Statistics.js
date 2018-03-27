
import { EventEmitter } from "events";

export default class Statistics {

  constructor() {
    this.visits = [];
  }

  addVisit(visit) {
    this.visits.push(visit);
  }

  get(name) {
    if (name === 'TOTAL_VISITS') {
      return this.visits.length;
    }
  }
}
