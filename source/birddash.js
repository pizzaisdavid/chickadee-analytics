import _ from 'lodash';

_.mixin({
  'filterByBird': filterByBird,
  'filterByFeeder': filterByFeeder,
  'groupByFeeder': groupByFeeder,
  'countByFeeder': countByFeeder,
  'zero': zero,
  'filterByTimestampsOlderThan': filterByTimestampsAfter,
  'countByTimestampStep': countByTimestampStep,
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

export default _;
