import DB from './index';
import { OntologyEntity } from '../types/types';
import getSustainabilityGoals from './queries/getSustainabilityGoals';

export default async (): Promise<OntologyEntity> => {
  const query = getSustainabilityGoals();
  const response = await DB.query(query, { transform: 'toJSON' });
  return response.records;
};
