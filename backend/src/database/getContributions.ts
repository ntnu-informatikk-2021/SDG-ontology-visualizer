import { mapRecordToObject } from '../common/database';
import { ApiError } from '../types/errorTypes';
import { Node } from '../types/ontologyTypes';
import DB from './index';
import getContributions from './queries/getContributions';

export default async (nodeId: string): Promise<Array<Node>> => {
  const query = getContributions(nodeId);
  if (!nodeId) {
    throw new ApiError(400, 'Could not parse ontology entity from the given class ID');
  }
  const response = await DB.query(query, { transform: 'toJSON' });
  return response.records.map(mapRecordToObject);
};
