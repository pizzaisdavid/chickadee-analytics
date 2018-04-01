
import { RESOURCES } from '../Statistics';

export default {
  name: 'move-order',
  clock: { timestamp: 60 },
  config: {
    [RESOURCES.RECENT_VISITS_SUMMARY]: {
      duration: 20,
      grouping: 10,
    },
  },
  birds: [
    { id: 'a' },
  ],
  feeders: [
    { id: 'X', longitude: 0, latitude: 0 },
    { id: 'Y', longitude: 0, latitude: 0 },
    { id: 'Z', longitude: 0, latitude: 0 },
  ],
  visits: [
    { timestamp: 51, feederId: 'Y', birdId: 'a'},
    { timestamp: 52, feederId: 'Z', birdId: 'a'},
    { timestamp: 50, feederId: 'X', birdId: 'a'},
  ],
  statistics: {
    visits: {
      total: 3,
      grouped: {
        50: 3,
        40: 0,
      },
    },
    birds: {
      checkins: {
        a: { X: 1, Y: 1, Z: 1 },
      },
      movements: {
        a: {
          X: { Y: 1 },
          Y: { X: 1, Z: 1 },
          Z: { Y: 1 },
        },
      },
    },
  },
};