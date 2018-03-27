
import SubscriptionManager from './SubscriptionManager';
import assert from 'assert';

describe('SubscriptionManager' , () => {
  const RESOURCE_NAME_1 = 'VALID_1';
  const RESOURCE_NAME_2 = 'VALID_2';
  const INVALID_RESOURCE_NAME = 'INVALID';
  let socket1;
  let socket2;
  let resourceNames;
  let manager;

  beforeEach(() => {
    socket1 = { id: '1' };
    socket2 = { id: '2' };
    resourceNames = [
      RESOURCE_NAME_1,
      RESOURCE_NAME_2,
    ];
    manager = new SubscriptionManager(resourceNames);
  });

  describe('subscribe', () => {

    it('success', () => {
      manager.subscribe(socket1, RESOURCE_NAME_1);
      assert.deepEqual(manager.count(RESOURCE_NAME_1), 1);
    });

    it('with invalid resource name', () => {
      manager.subscribe(socket1, INVALID_RESOURCE_NAME);
    });
  });

  describe('unsubscribe', () => {

    it('success', () => {
      manager.subscribe(socket1, RESOURCE_NAME_1);
      manager.unsubscribe(socket1, RESOURCE_NAME_1);
      assert.deepEqual(manager.count(RESOURCE_NAME_1), 0);
    });

    it('non-tracked socket', () => {
      manager.unsubscribe(socket1, RESOURCE_NAME_1);
      assert.deepEqual(manager.count(RESOURCE_NAME_1), 0);
    });

    it('with invalid resource name', () => {
      manager.unsubscribe(socket1, INVALID_RESOURCE_NAME);
    });
  });

  describe('remove', () => {

    it('success', () => {
      manager.subscribe(socket1, RESOURCE_NAME_1);
      manager.subscribe(socket1, RESOURCE_NAME_2);
      manager.remove(socket1);
      assert.deepEqual(manager.count(RESOURCE_NAME_1), 0);
      assert.deepEqual(manager.count(RESOURCE_NAME_2), 0);
    });

    it('non-tracked', () => {
      manager.remove(socket1);
      assert.deepEqual(manager.count(RESOURCE_NAME_1), 0);
      assert.deepEqual(manager.count(RESOURCE_NAME_2), 0);
    });
  });

  describe('push', () => {

    it('success', () => {
      manager.subscribe(socket1, RESOURCE_NAME_1);
      let count = 0;
      manager.push(RESOURCE_NAME_1, (x) => {
        count++;
      });
      assert.deepEqual(count, 1);
    });
  });
});