
import Api from './chickadee-api';
import express from 'express';

const app = express();
const api = Api.create('http://euclid.nmu.edu:11223/api', true);

const frequency = 60000;
let total = 0;

app.get('/total', (req, res) => {
  res.json({
    'total': total
  });
  res.end();
});

count().then((c) => {
  total = c;
});

setInterval(() => {
  count().then((c) => {
    total = c;
  });
}, frequency);

function count() {
  return api.get('visits?start=0&end=100000000000')
    .then((visits) => {
      return visits.length;
    });
}

const port = 3000;
console.log(`port ${port}`);
app.listen(port);