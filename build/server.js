"use strict";
/*import fs from 'fs';
import { Router, Request, Response, NextFunction, express } from 'express';
import cors from 'cors';
const app = express();

const port = 8000;
let timeServerStart: Date;

app.use(cors());

app.get('/status', (request: Request, response: Response) => {
  response.send(`${timeDiff(timeServerStart, Date.now())}`);
});

app.get('/api/events', (request, response) => {
  let { events } = JSON.parse(fs.readFileSync(__dirname + '/data/events.json', 'utf8'));
  //Если type есть в параметрах запроса
  if (request.query.type) {
    //множество типов. Смотрим тип у каждого события и добавляем в множество
    const expectedTypes = new Set();
    events.forEach(event => expectedTypes.add(event.type));
    const queryTypes = request.query.type.split(':');
    //проверяем типы из запроса queryTypes на наличие во множестве типов
    const hasIncorrectType = queryTypes.some(type => !expectedTypes.has(type));
    hasIncorrectType
      ? response.status(400).send(`incorrect type`)
      : (events = events.filter(event => queryTypes.includes(event.type)));
  }
  //Если не указан limit, то будет pageLimit= 10
  //Если не указана page, то будет 1

  const pageLimit = 10;
  const pageCount = 1;
  const limit = request.query.limit ? parseInt(request.query.limit, 10) : pageLimit;
  const page = request.query.page ? parseInt(request.query.page, 10) : pageCount;
  events = events.slice(limit * (page - 1), limit * page);

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
}*/
//# sourceMappingURL=server.js.map