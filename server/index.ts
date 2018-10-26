import * as http from 'http';
import * as express from 'express';
import * as cors from 'cors';
import { StatusRouter, EventRouter } from './routers';

let timeServerStart: number;
const app: express.Application = express();

//const port: number = process.env.PORT || 8000;
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

/*
export type ErrorRequestHandler = (err: Error, req: Request, res: Response, next: express.NextFunction)=>any;

app.use(function(type:ErrorEventHandler) {
  process.stdout.write(type.err.stack);
  type.res.status(500).send('Something broke!');
});
*/
