
export class Clock {

  get timestamp() {
    return Date.now() / 1000;
  }
}