
import { RESOURCE } from '../constants';

export default {
  name: 'associations-even',
  clock: { timestamp: 60 },
  config: {
    [RESOURCE.ASSOCIATIONS]: {
      timespan: 10
    }
  },
  birds: [ 'a', 'b' ],
  feeders: [ 'Z' ],
  visits: [
    { timestamp: 21, feeder: 'Z', bird: 'a'},
    { timestamp: 22, feeder: 'Z', bird: 'b'},
    { timestamp: 23, feeder: 'Z', bird: 'a'},
    { timestamp: 24, feeder: 'Z', bird: 'b'},
  ],
  statistics: {
    birds: {
      associations: {
        a: { b: 3 },
        b: { a: 3 },
      }
    },
  },
};