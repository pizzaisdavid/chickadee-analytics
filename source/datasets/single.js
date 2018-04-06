
import { RESOURCE } from '../constants';

export default {
  name: 'single',
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
  birds: [ 'a' ],
  feeders: [ 'Z' ],
  visits: [
    { timestamp: 55, feeder: 'Z', bird: 'a'},
  ],
  statistics: {
    feeders: {
      checkins: { Z: 1 },
    },
    visits: {
      total: 1,
      grouped: {
        30: 0,
        40: 0,
        50: 1,
      },
    },
    birds: {
      checkins: {
        a: { Z: 1 },
      },
      movements: {
        a: {},
      },
      associations: {},
    },
  },
};