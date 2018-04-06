
import { RESOURCES } from '../Statistics';

export default {
  name: 'movement-unordered',
  clock: { timestamp: 60 },
  config: {},
  birds: [ 'a' ],
  feeders: [ 'X', 'Y', 'Z' ],
  visits: [
    { timestamp: 51, feeder: 'Y', bird: 'a'},
    { timestamp: 52, feeder: 'Z', bird: 'a'},
    { timestamp: 50, feeder: 'X', bird: 'a'},
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