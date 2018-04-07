
import { RESOURCE } from '../constants';

export default {
  name: 'empty',
  clock: { timestamp: 60 },
  config: {},
  birds: [
    [ 'a', 'b', 'c' ],
    [ 'a', 'b', 'c' ],
  ],
  feeders: [
    [ 'X', 'Y', 'Z' ],
    [ 'X', 'Y', 'Z' ],
  ],
  visits: [],
  statistics: {
    birds: {
      count: 3,
    },
    feeders: {
      count: 3,
    },
  },
};