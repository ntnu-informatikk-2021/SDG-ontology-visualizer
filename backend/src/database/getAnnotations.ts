import DB from './index';
import { Annotation } from '../types/ontologyTypes';
import getAnnotations from './queries/getAnnotations';

export default async (classId: string): Promise<Annotation> => {
  const query = getAnnotations(classId);
  const response = await DB.query(query, { transform: 'toJSON' });
  return response.records[0];
};
