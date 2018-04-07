
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
      total: 3,
    },
    feeders: {
      total: 3,
    },
  },
};