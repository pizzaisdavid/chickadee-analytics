
export default class Statistics {

  constructor(visits) {
    this.visits = visits;
  }

  totalVisits() {
    return this.visits.length;
  }
}
