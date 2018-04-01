
import { RESOURCES } from '../Statistics';

export default {
  name: 'single',
  clock: { timestamp: 60 },
  config: {
    [RESOURCES.RECENT_VISITS_SUMMARY]: {
      duration: 30,
      grouping: 10,
    },
    [RESOURCES.RECENT_CHECKINS]: {
      duration: 30,
    },
  },
  birds: { 
    a: { id: 'a' },
  },
  feeders: {
    Z: { id: 'Z', longitude: 0, latitude: 0 },
  },
  visits: [
    { timestamp: 55, feederId: 'Z', birdId: 'a'},
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
        a: { },
      }
    },
  },
};