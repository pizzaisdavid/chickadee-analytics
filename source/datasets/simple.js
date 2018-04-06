
import { RESOURCE } from '../constants';

export default {
  name: 'simple',
  clock: { timestamp: 60 },
  config: {
    [RESOURCE.RECENT_VISITS_SUMMARY]: {
      duration: 30,
      grouping: 10,
    },
    [RESOURCE.RECENT_CHECKINS]: {
      duration: 30,
    },
    [RESOURCE.ASSOCIATIONS]: {
      timespan: 10
    }
  },
  birds: [ 'a', 'b' ],
  feeders: [ 'Z' ],
  visits: [
    { timestamp: 50, feeder: 'Z', bird: 'a'},
    { timestamp: 50, feeder: 'Z', bird: 'b'},
    { timestamp: 55, feeder: 'Z', bird: 'a'},
    { timestamp: 55, feeder: 'Z', bird: 'b'},
  ],
  statistics: {
    feeders: {
      checkins: { Z: 4 },
    },
    visits: {
      total: 4,
      grouped: {
        30: 0,
        40: 0,
        50: 4,
      },
    },
    birds: {
      checkins: {
        a: { Z: 2 },
        b: { Z: 2 },
      },
      movements: {
        a: {},
        b: {},
      },
      associations: {
        a: { b: 3 },
        b: { a: 3 },
      }
    },
  },
};