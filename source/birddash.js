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
  return _.filter(list, (item) => item.birdId === bird);
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
