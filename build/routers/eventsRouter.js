"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
//import { events } from './data/events.json';
const fs = require("fs");
const path = require('path');
const router = express_1.Router();
function getEvents(req, res, next) {
    const filePath = path.join(__dirname, '../data/events.json');
    let { events } = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    //Если type есть в параметрах запроса
    if (req.query.type) {
        //множество типов. Смотрим тип у каждого события и добавляем в множество
        const expectedTypes = new Set();
        events.forEach((event) => expectedTypes.add(event.type));
        const queryTypes = req.query.type.split(':');
        //проверяем типы из запроса queryTypes на наличие во множестве типов
        const hasIncorrectType = queryTypes.some((type) => !expectedTypes.has(type));
        hasIncorrectType
            ? res.status(400).send(`incorrect type`)
            : (events = events.filter((event) => queryTypes.includes(event.type)));
    }
    const pageLimit = 10;
    const pageCount = 1;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : pageLimit;
    const page = req.query.page ? parseInt(req.query.page, 10) : pageCount;
    events = events.slice(limit * (page - 1), limit * page);
    res.json({ events });
}
router.get('/', getEvents);
exports.EventRouter = router;
//# sourceMappingURL=eventsRouter.js.map