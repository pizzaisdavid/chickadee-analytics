
import { RESOURCE } from '../Statistics';

export default {
  name: 'empty',
  clock: { timestamp: 60 },
  config: {
    [RESOURCE.RECENT_VISITS_SUMMARY]: {
      duration: 30,
      grouping: 10,
    },
    [RESOURCE.RECENT_CHECKINS]: {
      duration: 30,
    },
    [RESOURCE.ASSOCIATIONS]: {
      timespan: 10
    }
  },
  birds: [],
  feeders: [],
  visits: [],
  statistics: {
    visits: {
      total: 0,
      grouped: {
        50: 0,
        40: 0,
        30: 0,
      },
    },
    birds: {
      checkins: {},
      movements: {},
      associations: {},
    },
    feeders: {
      checkins: {},
    },
  },
};