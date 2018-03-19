
import express from 'express';
import request from 'request';

const app = express();
const frequency = 60000;
let total = 0;

app.get('/', (req, res) => {
  res.json({
    'total': total
  });
});

total = count();

setInterval(() => {
  total = count();
}, frequency);

function count() {
  
}

const port = 3000;
console.log(`port ${port}`);
app.listen(port);