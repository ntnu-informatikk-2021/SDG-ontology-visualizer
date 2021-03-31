import { GraphDBError } from '@innotrade/enapso-graphdb-client';
import { AnyRequest, AnyResponse } from 'types/routerTypes';
import { ApiError } from '../../types/errorTypes';

const isGraphDBError = (e: object): boolean => {
  const objectKeys = Object.keys(e);
  if (!objectKeys.includes('statusCode')) return false;
  if (!objectKeys.includes('message')) return false;
  if (!objectKeys.includes('success')) return false;
  return true;
};

const resolveGraphDBErrorMessage = (err: GraphDBError): string => {
  if (err.statusCode === 400) return 'Invalid database query';
  if (err.statusCode === 401)
    return 'Incorrect username or password in database login. Check your environment variables';
  if (err.statusCode === 404)
    return 'Could not find database repository. Check your environment variables';
  return err.message;
};

export default (err: Error | ApiError | GraphDBError, req: AnyRequest, res: AnyResponse) => {
  if (isGraphDBError(err)) {
    const typedErr = err as GraphDBError;
    res.status(typedErr.statusCode);
    res.json({ message: resolveGraphDBErrorMessage(typedErr) });
  } else {
    const status = err instanceof ApiError ? err.statusCode : 500;
    res.status(status);
    res.json({ message: err.message });
  }
};
