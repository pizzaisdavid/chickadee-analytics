
import { RESOURCES } from '../Statistics';

export default {
  name: 'move-simple',
  clock: { timestamp: 60 },
  config: {
    [RESOURCES.RECENT_VISITS_SUMMARY]: {
      duration: 20,
      grouping: 10,
    },
  },
  birds: {
    a: { id: 'a' },
  },
  feeders: {
    Z: { id: 'Z', longitude: 0, latitude: 0 },
    Y: { id: 'Y', longitude: 0, latitude: 0 },
  },
  visits: [
    { timestamp: 50, feederId: 'Z', birdId: 'a'},
    { timestamp: 55, feederId: 'Y', birdId: 'a'},
  ],
  statistics: {
    visits: {
      total: 2,
      grouped: {
        50: 2,
        40: 0,
      },
    },
    birds: {
      checkins: {
        a: { Y: 1, Z: 1 },
      },
      movements: {
        a: {
          Y: { Z: 1 },
          Z: { Y: 1 },
        },
      },
    },
  },
};