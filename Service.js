

export class Service {

  constructor() {
    this.total = 0;
  }

  register() {
    // makes a request to the sync service with its ID and things it would like to subscribe to.
  }

  process(data) {
    const visits = data.visits;
  }

  compute(data) {
    const visits = data.visits;
    this.total += visits.length;
  }
}
