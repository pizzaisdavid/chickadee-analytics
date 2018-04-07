
import assert from 'assert';

import _ from './birddash';


describe('birddash', () => {

  describe('symmetric', () => {

    it('square', () => {
      const object = {
        a: { b: 1 },
        b: { a: 1 },
      };
  
      const expected = {
        a: { b: 2 },
        b: { a: 2 },
      };

      assert.deepEqual(_.symmetric(object), expected);
    });

    it('jagged - one row has one, the other does not.', () => {
      const object = {
        a: { b: 1, c: 1 },
        b: { a: 1, c: 1 },
        c: { a: 1 }
      };
  
      const expected = {
        a: { b: 2, c: 2 },
        b: { a: 2, c: 1 },
        c: { a: 2, b: 1 },
      };
      assert.deepEqual(_.symmetric(object), expected);
    });

    it('jagged - one row has one, the other does not.', () => {
      const object = {
        a: {},
        b: {},
      };
      const expected = {
        a: {},
        b: {},
      };
      assert.deepEqual(_.symmetric(object), expected);
    });
  });
});