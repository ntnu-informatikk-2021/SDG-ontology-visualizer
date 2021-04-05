import { ApiError } from '../types/errorTypes';

// eslint-disable-next-line import/prefer-default-export
export const verifyRequestQueryParams = (...args: Array<string | number | undefined>) => {
  if (args.some((arg) => arg === undefined)) throw new ApiError(400, 'Missing query data');
  if (args.some((arg) => typeof arg === 'number' && Number.isNaN(arg)))
    throw new ApiError(400, 'Expected number in query data provided as string');
};
