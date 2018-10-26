"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
const routers_1 = require("./routers");
let timeServerStart;
const app = express();
const port = 8000;
app.use(cors());
app.use('/status', routers_1.StatusRouter);
app.use('/api/events', routers_1.EventRouter);
app.use((req, res, next) => {
    res
        .type('text/html')
        .status(404)
        .send('<h1>Page not found</h1>');
});
app.listen(port, () => {
    timeServerStart = Date.now();
    console.log(`Listening at http://localhost:${port}/`);
});
//# sourceMappingURL=index.js.map