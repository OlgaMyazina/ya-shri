"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eventsRouter_1 = require("./routers/eventsRouter");
const statusRouter_1 = require("./routers/statusRouter");
const express = require("express");
//const debug = require('debug')('express:server');
class App {
    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
    }
    middleware() {
        //что-то нужно?
    }
    routes() {
        this.express.use('/status', statusRouter_1.StatusRouter);
        this.express.use('/api/events', eventsRouter_1.EventRouter);
    }
}
exports.default = new App().express;
//# sourceMappingURL=app.js.map