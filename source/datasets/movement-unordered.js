
import { RESOURCES } from '../Statistics';

export default {
  name: 'movement-unordered',
  clock: { timestamp: 60 },
  config: {},
  birds: [ 'a' ],
  feeders: [ 'X', 'Y', 'Z' ],
  visits: [
    { timestamp: 51, feederId: 'Y', birdId: 'a'},
    { timestamp: 52, feederId: 'Z', birdId: 'a'},
    { timestamp: 50, feederId: 'X', birdId: 'a'},
  ],
  statistics: {
    birds: {
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