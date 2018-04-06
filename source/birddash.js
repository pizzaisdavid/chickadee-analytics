import _ from 'lodash';

_.mixin({
  'filterByBird': filterByBird,
  'filterByFeeder': filterByFeeder,
  'groupByFeeder': groupByFeeder,
  'countByBird': countByBird,
  'countByFeeder': countByFeeder,
  'zero': zero,
  'filterByTimestampsOlderThan': filterByTimestampsAfter,
  'filterForwardAssociations': filterForwardAssociations, 
  'countByTimestampStep': countByTimestampStep,
  'symmetric': symmetric,
});

function filterByBird(list, bird) {
  return _.filter(list, (item) => item.bird === bird);
}

function filterByFeeder(list, feeder) {
  return _.filter(list, (item) => item.feeder === feeder);
}

function filterByTimestampsAfter(visits, limitTimestamp) {
  return _.filter(visits, (visit) => visit.timestamp >= limitTimestamp);
}

function countByFeeder(visits) {
  return _.countBy(visits, 'feeder');
}

function countByBird(visits) {
  return _.countBy(visits, 'bird');
}

function countByTimestampStep(visits, step) {
  return _.countBy(visits, (visit) => Math.floor(visit.timestamp / step) * step);
}

function groupByFeeder(visits) {
  return _.groupBy(visits, 'feeder');
}

function zero(list) {
  const destination = {};
  _.each(list, (value) => {
    destination[value] = 0;
  });
  return destination;
}

function filterForwardAssociations(visits, bird, duration) {
  let timestamp;
  let location;
  return _.filter(visits, (visit) => {
    if (visit.bird === bird) {
      timestamp = visit.timestamp;
      location = visit.feeder;
      return false;
    }
    if (visit.feeder !== location) {
      return false;
    }
    if (timestamp + duration < visit.timestamp) {
      return false;
    }
    return true;
  });
}

function symmetric(matrix) {
  const newMatrix = {};
  _.each(matrix, (row, key1) => {
    _.each(row, (value, key2) => {
      let v1 = 0;
      let v2 = 0;
      try {
        v1 = matrix[key1][key2];
      } catch (e) {
      }
      try {
        v2 = matrix[key2][key1];
      } catch (e) {
      }
      const total = v1 + v2;
      _.set(newMatrix, [key1, key2], total);
      _.set(newMatrix, [key2, key1], total);
    })
  });
  return newMatrix;
}

export default _;
