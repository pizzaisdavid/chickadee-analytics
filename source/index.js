
import Api from './chickadee-api';
import express from 'express';

const app = express();
const api = Api.create({
  baseURL: 'http://euclid.nmu.edu:11223/api',
  isDebug: true
});
const frequency = 60000;
let total = c;

app.get('/total',(req, res) => {
  res.json({
    'total': total
  });
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
  return api.get('/visits')
    .then((visits) => {
      total = visits.length;
    });
}

const port = 3000;
console.log(`port ${port}`);
app.listen(port);