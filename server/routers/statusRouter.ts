import { Router, Request, Response, NextFunction } from 'express';

const router: Router = Router();
const timeServerStart: number = Date.now();

function timeDiff(timeStart: number, timeCurrent: number) {
  const tDiff: Date = new Date(timeCurrent - timeStart);
  return [
    `0${tDiff.getUTCHours()}`.slice(-2),
    `0${tDiff.getUTCMinutes()}`.slice(-2),
    `0${tDiff.getUTCSeconds()}`.slice(-2)
  ].join(':');
}
function getStatus(req: Request, res: Response, next: NextFunction) {
  res.send(`${timeDiff(timeServerStart, Date.now())}`);
}

router.get('/', getStatus);

export const StatusRouter: Router = router;
