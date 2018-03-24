
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
// Add headers
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.get('/api/total', (req, res) => {
  res.json({
    'total': total
  });
  res.end();
});

console.log(`port ${port}`);
app.listen(port);
