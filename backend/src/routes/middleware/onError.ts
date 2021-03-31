import { GraphDBError } from '@innotrade/enapso-graphdb-client';
import { ApiError } from '../../types/types';

const isGraphDBError = (e: object) => {
  const objectKeys = Object.keys(e);
  if (!objectKeys.includes('statusCode')) return false;
  if (!objectKeys.includes('message')) return false;
  if (!objectKeys.includes('success')) return false;
  return true;
};

const resolveGraphDBErrorMessage = (err: GraphDBError) => {
  if (err.statusCode === 400) return 'Invalid database query';
  if (err.statusCode === 401)
    return 'Incorrect username or password in database login. Check your environment variables';
  if (err.statusCode === 404)
    return 'Could not find database repository. Check your environment variables';
  return err.message;
};

export default (err, req, res) => {
  if (isGraphDBError(err)) {
    res.status(err.statusCode);
    res.json({ message: resolveGraphDBErrorMessage(err) });
  } else {
    const status = err instanceof ApiError ? err.statusCode : 500;
    res.status(status);
    res.json({ message: err.message });
  }
};
