import DB from './index';
import { OntologyEntity } from '../types/types';
import getAnnotations from './queries/getAnnotations';
import { mapIdToOntologyEntity } from '../common/database';

export default async (classId: string): Promise<Array<OntologyEntity>> => {
  const query = getAnnotations(classId);
  const response = await DB.query(query, { transform: 'toJSON' });
  return response.records[0];
};
