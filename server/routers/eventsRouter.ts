import { Router, Request, Response, NextFunction } from 'express';
//import { events } from './data/events.json';
import * as fs from 'fs';
const path = require('path');
//import { request } from 'http';

interface DeviceEvent {
  type: string;
  title: string;
  source: string;
  time: string;
  description: null | string;
  icon: string;
}
const router: Router = Router();

function getEvents(req: Request, res: Response, next: NextFunction) {
  const filePath = path.join(__dirname, '../data/events.json');
  let { events } = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  //Если type есть в параметрах запроса
  if (req.query.type) {
    //множество типов. Смотрим тип у каждого события и добавляем в множество
    const expectedTypes = new Set();
    events.forEach((event: DeviceEvent) => expectedTypes.add(event.type));
    const queryTypes = req.query.type.split(':');
    //проверяем типы из запроса queryTypes на наличие во множестве типов
    const hasIncorrectType = queryTypes.some((type: string) => !expectedTypes.has(type));
    hasIncorrectType
      ? res.status(400).send(`incorrect type`)
      : (events = events.filter((event: DeviceEvent) => queryTypes.includes(event.type)));
  }
  const pageLimit = 10;
  const pageCount = 1;
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : pageLimit;
  const page = req.query.page ? parseInt(req.query.page, 10) : pageCount;
  events = events.slice(limit * (page - 1), limit * page);

  res.json({ events });
}

router.get('/', getEvents);

export const EventRouter: Router = router;
