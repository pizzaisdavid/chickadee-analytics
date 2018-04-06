
import assert from 'assert';

import _ from './birddash';


describe('birddash', () => {

  describe('symmetric', () => {

    it('square', () => {
      const object = {
        a: { b: 2 },
        b: { a: 1 },
      };
  
      const expected = {
        a: { b: 3 },
        b: { a: 3 },
      };

      assert.deepEqual(_.symmetric(object), expected);
    });
  });
});