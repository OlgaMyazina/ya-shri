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
Д
*/

const express = require('express');
const app = express();
const port = 8000;
let timeServerStart;

app.use((request, response, next) => {
  console.log(request.headers);
  next();
});

const requestTime = (request, response, next) => {
  //request.requestTime = time_format(Date.now());
  //console.log(time_format(Date.now()));
  next();
};

app.use(requestTime);

app.get('/status', (request, response) => {
  const now = Date.now();
  response.send(
    `старт сервера: ${timeFormat(timeServerStart)}, текущее время: ${timeFormat(now)}, разница: ${timeDiff(
      timeServerStart,
      now
    )}`
  );
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

function timeFormat(date) {
  options = {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false
  };
  return new Intl.DateTimeFormat('ru-RU', options).format(date);
}

function timeDiff(timeStart, timeCurrent) {
  const tDiff = new Date(timeCurrent - timeStart);
  console.log(tDiff);
  return [
    `0${tDiff.getUTCHours()}`.slice(-2),
    `0${tDiff.getUTCMinutes()}`.slice(-2),
    `0${tDiff.getUTCSeconds()}`.slice(-2)
  ].join(':');
}

/*
app.use((request, response, next) => {
 console.log(request.headers);
 next();
})
app.use((request, response, next) => {
 request.chance = Math.random();
 next();
})
app.get('/', (request, response) => {
 response.json({
 chance: request.chance
 })
})
app.get("/api/events", eventsHandler);

*/
