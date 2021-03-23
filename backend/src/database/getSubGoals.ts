import { ApiError } from '../types/types';
import DB from './index';
import getSubGoals from './queries/getSubGoals';

export default async (nodeId: string): Promise<Node> => {
  const query = getSubGoals(nodeId);
  if (!nodeId) {
    throw new ApiError(400, 'Could not parse ontology entity from the given class ID');
  }
  const response = await DB.query(query, { transform: 'toJSON' });
  return response.records;
};
