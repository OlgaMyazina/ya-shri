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
const dataTypes = require('./data/config');

const express = require('express');
const app = express();
const port = 8000;
let timeServerStart;

app.use((request, response, next) => {
  console.log(request.headers);
  next();
});

app.get('/status', (request, response) => {
  response.send(`${timeDiff(timeServerStart, Date.now())}`);
});

app.get('/api/events', (request, response) => {
  let { events } = data;
  //Если есть параметры
  if (request.query) {
    //Если это type
    if (request.query.type) {
      const { types } = dataTypes;
      const queryTypes = request.query.type.split(':');
      //проверяем типы из запроса queryTypes на наличие в конф. types
      const unCorrectTypes = queryTypes.find(type => !types.includes(type));
      console.log(`correctTypes ${unCorrectTypes}`);
      if (unCorrectTypes) {
        response.status(400).send(`incorrect type`);
      } else {
        const eventsNew = events.filter(event => event.type === queryTypes[0]);
        response.send(queryTypes.map(type => events.filter(event => event.type === type)));
      }
    }
  }
  app.use((err, request, response, next) => {
    // логирование ошибки, пока просто console.log
    console.log(err);
    response.status(500).send(`Something broke!`);
    next();
  });
  /*
  console.log(request.params);
  console.log(request.query);
  console.log(request.body);
  */
  response.json({
    events
  });
  console.log(request.params);
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

function timeDiff(timeStart, timeCurrent) {
  const tDiff = new Date(timeCurrent - timeStart);
  console.log(tDiff);
  return [
    `0${tDiff.getUTCHours()}`.slice(-2),
    `0${tDiff.getUTCMinutes()}`.slice(-2),
    `0${tDiff.getUTCSeconds()}`.slice(-2)
  ].join(':');
}
