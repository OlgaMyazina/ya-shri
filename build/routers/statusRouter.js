"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
const timeServerStart = Date.now();
function timeDiff(timeStart, timeCurrent) {
    const tDiff = new Date(timeCurrent - timeStart);
    return [
        `0${tDiff.getUTCHours()}`.slice(-2),
        `0${tDiff.getUTCMinutes()}`.slice(-2),
        `0${tDiff.getUTCSeconds()}`.slice(-2)
    ].join(':');
}
function getStatus(req, res, next) {
    res.send(`${timeDiff(timeServerStart, Date.now())}`);
}
router.get('/', getStatus);
exports.StatusRouter = router;
//# sourceMappingURL=statusRouter.js.map