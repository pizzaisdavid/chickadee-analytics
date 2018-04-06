
import { RESOURCES } from '../Statistics';

export default {
  name: 'movement',
  clock: { timestamp: 60 },
  config: {},
  birds: [ 'a' ],
  feeders: {
    Z: { id: 'Z', longitude: 0, latitude: 0 },
    Y: { id: 'Y', longitude: 0, latitude: 0 },
  },
  visits: [
    { timestamp: 50, feederId: 'Z', birdId: 'a'},
    { timestamp: 55, feederId: 'Y', birdId: 'a'},
  ],
  statistics: {
    birds: {
      movements: {
        a: {
          Y: { Z: 1 },
          Z: { Y: 1 },
        },
      },
    },
  },
};