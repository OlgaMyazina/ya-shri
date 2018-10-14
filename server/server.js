const express = require('express');
const app = express();
const port = 8000;

app.get('/', (request, response) => {
  response.send('Hello from express');
});

app.listen(port, err => {
  if (err) {
    return console.log('something bad', err);
  }
  console.log(`server listening on ${port}`);
});
