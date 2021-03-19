export class ApiError extends Error {
  status: string;
  body: any;

  constructor(res: any, body: any) {
    super(body.message || res.statusText);
    this.status = res.status;
    this.name = 'ApiError';
    this.body = body;
  }
}

export type ErrorState = {
  error: Error | null;
};

export type SetErrorStateAction = {
  type: typeof SET_ERROR;
  payload: Error;
};

export type ClearErrorStateAction = {
  type: typeof CLEAR_ERROR;
};

export type ErrorStateAction = SetErrorStateAction | ClearErrorStateAction;

export const SET_ERROR = 'SET_ERROR';
export const CLEAR_ERROR = 'CLEAR_ERROR';
