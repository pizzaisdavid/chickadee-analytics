
import { RESOURCE } from '../constants';

export default {
  name: 'one-bird-many-feeders',
  clock: { timestamp: 60 },
  config: {
    [RESOURCE.RECENT_CHECKINS]: {
      duration: 30,
    },
  },
  birds: [ 'a' ],
  feeders: [ 'U', 'V', 'W', 'X', 'Y', 'Z' ],
  visits: [
    { timestamp: 50, feeder: 'U', bird: 'a'},
    { timestamp: 51, feeder: 'V', bird: 'a'},
    { timestamp: 52, feeder: 'W', bird: 'a'},
    { timestamp: 53, feeder: 'X', bird: 'a'},
    { timestamp: 54, feeder: 'Y', bird: 'a'},
    { timestamp: 55, feeder: 'Z', bird: 'a'},
  ],
  statistics: {
    birds: {
      movements: {
        a: {
          U: { V: 1 },
          V: { U: 1, W: 1 },
          W: { V: 1, X: 1 },
          X: { W: 1, Y: 1 },
          Y: { X: 1, Z: 1 },
          Z: { Y: 1 },
        },
      },
    },
    feeders: {
      checkins: {
        U: 1,
        V: 1,
        W: 1,
        X: 1,
        Y: 1,
        Z: 1,
      },
    },
  },
};