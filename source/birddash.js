import _ from 'lodash';

_.mixin({
  'filterByBird': filterByBird,
  'filterByFeeder': filterByFeeder,
  'groupByFeeder': groupByFeeder,
  'countByFeeder': countByFeeder,
  'zero': zero,
  'filterByTimestampsOlderThan': filterByTimestampsOlderThan,
});

function filterByBird(list, bird) {
  return _.filter(list, (item) => item.bird === bird);
}

function filterByFeeder(list, feeder) {
  return _.filter(list, (item) => item.feeder === feeder);
}

function countByFeeder(visits) {
  return _.countBy(visits, 'feeder');
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

function filterByTimestampsOlderThan(visits, limitTimestamp) {
  return _.filter(visits, (visit) => visit.timestamp >= limitTimestamp);
}

export default _;
