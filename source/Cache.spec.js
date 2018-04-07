
import assert from 'assert';

import { Cache } from './Cache';

describe('Cache', () => {
  const resourceName = 'test';
  let clock;
  let cache;

  beforeEach(() => {
    clock = { timestamp: 50 };
    cache = new Cache({
      [resourceName]: {
        compute: () => {
          return 'hi';
        },
        lifespan: 10,
        timestamp: -Infinity,
      },
    }, clock);
  });

  describe('isOutOfDate', () => {

    it('initally out of date', () => {
      assert.deepEqual(cache.isAnswerOutOfDate(resourceName), true);
    });

    it('valid after resfreshing', () => {
      cache.refresh(resourceName);
      assert.deepEqual(cache.isAnswerOutOfDate(resourceName), false);
    });

    it('out of date after timeout', () => {
      cache.refresh(resourceName);
      clock.timestamp = 100;
      assert.deepEqual(cache.isAnswerOutOfDate(resourceName), true);
    });

  });

});