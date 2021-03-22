import DB from './index';
import getSustainabilityGoals from './queries/getSustainabilityGoals';

export default async (): Promise<Array<Node>> => {
  const query = getSustainabilityGoals();
  const response = await DB.query(query, { transform: 'toJSON' });
  return response.records;
};
