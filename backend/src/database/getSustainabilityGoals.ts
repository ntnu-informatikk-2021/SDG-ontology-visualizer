import DB from './index';
import { OntologyEntity } from '../types/types';
import getSustainabilityGoals from './queries/getSustainabilityGoals';

export default async (classId: string): Promise<OntologyEntity> => {
  const query = getSustainabilityGoals(classId);
  const response = await DB.query(query, { transform: 'toJSON' });
  return response.records;
};
