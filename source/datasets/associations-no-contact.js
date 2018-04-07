
import { RESOURCE } from '../constants';

export default {
  name: 'associations-no-contact',
  clock: { timestamp: 60 },
  config: {
    [RESOURCE.ASSOCIATIONS]: {
      timespan: 10
    }
  },
  birds: [ 'a', 'b' ],
  feeders: [ 'Y', 'Z' ],
  visits: [
    { timestamp: 20, feeder: 'Y', bird: 'a'},
    { timestamp: 25, feeder: 'Z', bird: 'b'},
    { timestamp: 40, feeder: 'Y', bird: 'a'},
    { timestamp: 45, feeder: 'Z', bird: 'b'},
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