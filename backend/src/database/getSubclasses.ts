import DB from './index';
import { OntologyEntity } from '../types/types';
import getSubclasses from './queries/getSubclasses';
import { mapIdToOntologyEntity } from '../common/database';

export default async (classId: string): Promise<Array<OntologyEntity>> => {
  const query = getSubclasses(classId);
  const response = await DB.query(query, { transform: 'toJSON' });
  return response.records.map((rec) => ({
    SubClass: mapIdToOntologyEntity(rec.directSub),
  }));
};
