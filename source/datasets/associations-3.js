
import { RESOURCE } from '../constants';

export default {
  name: 'associations-3',
  clock: { timestamp: 60 },
  config: {
    [RESOURCE.ASSOCIATIONS]: {
      timespan: 10
    }
  },
  birds: [ 'a', 'b' ],
  feeders: [ 'Z' ],
  visits: [
    { timestamp: 20, feeder: 'Z', bird: 'a'},
    { timestamp: 21, feeder: 'Z', bird: 'b'},
    { timestamp: 22, feeder: 'Z', bird: 'b'},
    { timestamp: 23, feeder: 'Z', bird: 'a'},
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