import _ from 'lodash';

_.mixin({
  'filterByBird': filterByBird,
  'filterByFeeder': filterByFeeder,
  'groupByFeeder': groupByFeeder,
  'countByFeeder': countByFeeder,
  'zero': zero,
  'filterByTimestampsOlderThan': filterByTimestampsOlderThan,
});

function filterByBird(list, id) {
  return _.filter(list, (item) => item.birdId === id);
}

function filterByFeeder(list, id) {
  return _.filter(list, (item) => item.feederId === id);
}

function countByFeeder(visits) {
  return _.countBy(visits, 'feederId');
}

function groupByFeeder(visits) {
  return _.groupBy(visits, 'feederId');
}

function zero(source) {
  const destination = {};
  _.each(source, (value, key) => {
    destination[key] = 0;
  });
  return destination;
}

function filterByTimestampsOlderThan(visits, limitTimestamp) {
  return _.filter(visits, (visit) => visit.timestamp >= limitTimestamp);
}

export default _;
