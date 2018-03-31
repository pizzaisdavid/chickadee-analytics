
import { RESOURCES } from '../Statistics';

export default {
  name: 'simple',
  clock: { timestamp: 60 },
  config: {
    [RESOURCES.RECENT_VISITS_SUMMARY]: {
      duration: 30,
      grouping: 10,
    },
    [RESOURCES.ASSOCIATIONS]: {
      grouping: 1,
    },
  },
  birds: [
    { id: 'a' },
    { id: 'b' },
  ],
  feeders: [
    { id: 'Z', longitude: 0, latitude: 0 },
  ],
  visits: [
    { timestamp: 50, feeder: 'Z', bird: 'a'},
    { timestamp: 50, feeder: 'Z', bird: 'b'},
    { timestamp: 55, feeder: 'Z', bird: 'a'},
    { timestamp: 55, feeder: 'Z', bird: 'b'},
  ],
  statistics: {
    visits: {
      total: 4,
      grouped: {
        30: 0,
        40: 0,
        50: 4,
      },
    },
    birds: {
      checkins: {
        a: { Z: 2 },
        b: { Z: 2 },
      },
      associations: {
        a: { b: 2 },
        b: { a: 2 },
      },
    },
  },
};