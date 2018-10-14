/*
Написать сервер на express который будет подниматься на 8000
порту и обрабатывать два роута:
1. /status — должен выдавать время, прошедшее с запуска
сервера в формате hh:mm:ss
2. /api/events — должен отдавать содержимое файла events.json.
При передаче get-параметра type включается фильтрация по
типам событий. При передаче некорректного type — отдавать
статус 400 "incorrect type". (/api/events?type=info:critical)
Все остальные роуты должны отдавать <h1>Page not found</h1>,
с корректным статусом 404.

Перейти на POST-параметры.
Сделать пагинацию событий — придумать и реализовать API,
позволяющее выводить события постранично.
*/

const data = require('./data/events');
const config = require('./data/config');

const express = require('express');
const app = express();
const port = 8000;
let timeServerStart;

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
