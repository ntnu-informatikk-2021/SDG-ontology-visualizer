import api from './api';

// eslint-disable-next-line import/prefer-default-export
export const getRelations = (classId: string): Promise<any> =>
  api.GET(`ontologies/relations/${encodeURIComponent(classId)}`);

export const getDescription = (classId: string): Promise<any> =>
  api.GET(`ontologies/description/${encodeURIComponent(classId)}`);
