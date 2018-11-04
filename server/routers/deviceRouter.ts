import { Router, Request, Response, NextFunction } from 'express';

const router: Router = Router();
router.get('/', function(req, res) {
  res.render('device', { layout: 'device.hbs' });
});
