
import { RESOURCE } from '../constants';

export default {
  name: 'associations-timeout',
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
    { timestamp: 50, feeder: 'Z', bird: 'b'},
  ],
  statistics: {
    birds: {
      associations: {
        a: {},
        b: {},
      }
    },
  },
};