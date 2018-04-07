
import { RESOURCE } from '../constants';

export default {
  name: 'associations-0',
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
    { timestamp: 25, feeder: 'Z', bird: 'b'},
    { timestamp: 40, feeder: 'Z', bird: 'a'},
    { timestamp: 45, feeder: 'Z', bird: 'b'},
  ],
  statistics: {
    birds: {
      associations: {
        a: { b: 2 },
        b: { a: 2 },
      }
    },
  },
};