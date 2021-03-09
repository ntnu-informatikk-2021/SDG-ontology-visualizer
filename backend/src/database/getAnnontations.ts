import DB from './index';
import { OntologyEntity } from '../types/types';
import getAnnontations from './queries/getAnnontations';
import { mapIdToOntologyEntity } from '../common/database';

export default async (classId: string): Promise<Array<OntologyEntity>> => {
  const query = getAnnontations(classId);
  const response = await DB.query(query, { transform: 'toJSON' });
  return response.records[0];
};
