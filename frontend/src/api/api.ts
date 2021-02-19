import { setError } from '../state/reducers/apiErrorReducer';
import store from '../state/store';
import { ApiError } from '../types/apiTypes';

const API_BASE = 'http://localhost:3001/api';

const responseHandler = async (res: Response): Promise<any> => {
  if (!res.ok) {
    const body = await res.json();
    store.dispatch(setError(new ApiError(res, body)));
  }

  const json = await res.json();
  return json;
};

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export default {
  GET: (path: string, headers?: object) =>
    window
      .fetch(`${API_BASE}/${path}`, { method: 'GET', headers: { ...defaultHeaders, ...headers } })
      .then(responseHandler),
  POST: (path: string, body: object, headers?: object) =>
    window
      .fetch(`${API_BASE}/${path}`, {
        method: 'POST',
        headers: { ...defaultHeaders, ...headers },
        body: JSON.stringify(body),
      })
      .then(responseHandler),
  PUT: (path: string, body: object, headers?: object) =>
    window
      .fetch(`${API_BASE}/${path}`, {
        method: 'PUT',
        headers: { ...defaultHeaders, ...headers },
        body: JSON.stringify(body),
      })
      .then(responseHandler),
  DELETE: (path: string, body: object, headers?: object) =>
    window
      .fetch(`${API_BASE}/${path}`, {
        method: 'DELETE',
        headers: { ...defaultHeaders, ...headers },
        body: JSON.stringify(body),
      })
      .then(responseHandler),
};
