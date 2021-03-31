import { Node, ApiError } from '../types/types';
import { mapRecordToObject } from '../common/database';
import DB from './index';
import getDevelopmentArea from './queries/getDevelopmentArea';

export default async (nodeId: string): Promise<Array<Node>> => {
  const query = getDevelopmentArea(nodeId);
  if (!nodeId) {
    throw new ApiError(400, 'Could not parse ontology entity from the given class ID');
  }
  const response = await DB.query(query, { transform: 'toJSON' });
  return response.records.map(mapRecordToObject);
};
