
import express from 'express';
import axios from 'axios';

const app = express();
const frequency = 60000;
let total = 0;

app.get('/', (req, res) => {
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

async function count() {
  return axios.get('http://euclid.nmu.edu:11223/api/visits?start=0&end=10000000000')
    .then((response) => {
      const data = response.data;
      const count = data.length;
      console.log(`count: ${count}`);
      return count;
    });
}

const port = 3000;
console.log(`port ${port}`);
app.listen(port);