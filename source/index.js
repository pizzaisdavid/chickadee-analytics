
import Api from './Api';

import express from 'express';

const app = express();
const port = 3000;

const api = new Api();

let total;

api.on('initialize', () => {
  console.log('init');
  total = 0;
});

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
