import DB from './index';
import { OntologyEntity } from '../types/types';
import getAnnotations from './queries/getAnnotations';

export default async (classId: string): Promise<OntologyEntity> => {
  const query = getAnnotations(classId);
  const response = await DB.query(query, { transform: 'toJSON' });
  return response.records[0];
};
