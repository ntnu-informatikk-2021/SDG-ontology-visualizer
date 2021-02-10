import api from './api';

// eslint-disable-next-line import/prefer-default-export
export const getRelations = (className: string): Promise<any> =>
  api.GET(`/ontologies/%3A${className}`);
