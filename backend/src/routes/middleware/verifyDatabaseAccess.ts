import { Request, Response, NextFunction } from 'express';
import { getLoginStatus } from '../../database/login';
import onError from './onError';

export default (req: Request, res: Response, next: NextFunction) => {
  if (getLoginStatus()) {
    next();
  } else {
    onError(new Error('Server not connected to database'), req, res);
  }
};
