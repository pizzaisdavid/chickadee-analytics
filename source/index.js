
import Api from './chickadee-api';
import express from 'express';

const app = express();
const port = 3000;

const api = new Api('http://euclid.nmu.edu:11223/api');

let total = 0;

api.on('visit', () => {
  total++;
});

app.get('/total', (req, res) => {
  res.json({
    'total': total
  });
  res.end();
});

console.log(`port ${port}`);
app.listen(port);