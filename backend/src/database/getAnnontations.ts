import DB from './index';
import { OntologyEntity } from '../types/types';
import getAnnontations from './queries/getAnnontations';
<<<<<<< HEAD
=======
import { mapIdToOntologyEntity } from '../common/database';
>>>>>>> 513f0e43dde3a0dc7756604bf4e48972ac865dbf

export default async (classId: string): Promise<Array<OntologyEntity>> => {
  const query = getAnnontations(classId);
  const response = await DB.query(query, { transform: 'toJSON' });
  return response.records[0];
};
