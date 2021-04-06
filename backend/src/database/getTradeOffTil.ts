import { Node } from '../types/ontologyTypes';
import { ApiError } from '../types/errorTypes';
import { mapRecordToObject } from '../common/database';
import DB from './index';
import getTradeOff from './queries/getTradeOff';

export default async (nodeId: string): Promise<Array<Node>> => {
  const query = getTradeOff(nodeId);
  if (!nodeId) {
    throw new ApiError(400, 'Could not parse ontology entity from the given class ID');
  }
  const response = await DB.query(query, { transform: 'toJSON' });
  return response.records.map(mapRecordToObject);
};
