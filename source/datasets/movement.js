
import { RESOURCES } from '../Statistics';

export default {
  name: 'movement',
  clock: { timestamp: 60 },
  config: {},
  birds: [ 'a' ],
  feeders: [ 'Y', 'Z' ],
  visits: [
    { timestamp: 50, feeder: 'Z', bird: 'a'},
    { timestamp: 55, feeder: 'Y', bird: 'a'},
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