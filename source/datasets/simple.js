
import { RESOURCES } from '../Statistics';

export default {
  name: 'simple',
  clock: { timestamp: 60 },
  config: {
    [RESOURCES.RECENT_VISITS_SUMMARY]: {
      duration: 30,
      grouping: 10,
    },
  },
  birds: {
    a: { id: 'a' },
    b: { id: 'b' },    
  },
  feeders: {
    Z: { id: 'Z', longitude: 0, latitude: 0 },
  },
  visits: [
    { timestamp: 50, feederId: 'Z', birdId: 'a'},
    { timestamp: 50, feederId: 'Z', birdId: 'b'},
    { timestamp: 55, feederId: 'Z', birdId: 'a'},
    { timestamp: 55, feederId: 'Z', birdId: 'b'},
  ],
  statistics: {
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
    },
  },
};