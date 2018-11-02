import * as http from 'http';
import * as express from 'express';
import * as cors from 'cors';
import { StatusRouter, EventRouter } from './routers';

let timeServerStart: number;
const app: express.Application = express();

const port: number = 8000;
app.use(cors());
app.use('/status', StatusRouter);
app.use('/api/events', EventRouter);
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
