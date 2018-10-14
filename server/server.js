const data = require('./data/events');
const config = require('./data/config');

const express = require('express');
const cors = require('cors');
const app = express();

const port = 8000;
let timeServerStart;

app.use(cors());

app.get('/status', (request, response) => {
  response.send(`${timeDiff(timeServerStart, Date.now())}`);
});

app.get('/api/events', (request, response) => {
  let { events } = data;
  //Если type есть в параметрах запроса
  if (request.query.type) {
    const expectedTypes = config.types;
    const queryTypes = request.query.type.split(':');
    //проверяем типы из запроса queryTypes на наличие в конф. types
    const hasIncorrectType = queryTypes.some(type => !expectedTypes.includes(type));
    hasIncorrectType
      ? response.status(400).send(`incorrect type`)
      : (events = events.filter(event => queryTypes.includes(event.type)));
  }
  //Если не указан limit, то будет 10
  //Если не указана page, то будет 1
  if (request.query.page) {
    const limit = request.query.limit ? parseInt(request.query.limit) : config.pageLimit;
    const page = parseInt(request.query.page);
    events = events.slice(limit * (page - 1), limit * page);
  }
  response.json({ events });
});

app.use(function(req, res) {
  res.status(404).send('<h1>Not found</h1>');
});

app.listen(port, err => {
  if (err) {
    return console.log('something bad', err);
  }
  timeServerStart = Date.now();
  console.log(`server listening on ${port}`);
});

function timeDiff(timeStart, timeCurrent) {
  const tDiff = new Date(timeCurrent - timeStart);
  return [
    `0${tDiff.getUTCHours()}`.slice(-2),
    `0${tDiff.getUTCMinutes()}`.slice(-2),
    `0${tDiff.getUTCSeconds()}`.slice(-2)
  ].join(':');
}

/*
app.use((err, request, response, next) => {
  // логирование ошибки, пока просто console.log
  console.log(err);
  response.status(500).send(`Something broke!`);
  next();
});
*/

/*
function timeFormat(date) {
  options = {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false
  };
  return new Intl.DateTimeFormat('ru-RU', options).format(date);
}
*/
