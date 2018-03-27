
import * as _ from 'lodash';
import Set from 'collections/set';

export default class SubscriptionManager {

  constructor(names) {
    this.resources = {};
    _.each(names, (r) => {
      this.resources[r] = new Set();
    });
  }

  subscribe(socket, name) {
    const collection = this.resources[name];
    if (collection) {
      collection.add(socket);
    }
  }

  count(name) {
    return this.resources[name].length;
  }

  unsubscribe(socket, name) {
    const collection = this.resources[name];
    if (collection) {
      return collection.delete(socket);
    }
    return false;
  }

  remove(socket) {
    _.each(this.resources, (value, key) => {
      value.delete(socket);
    });
  }

  queue(resourceName, newValue) {

  }

}