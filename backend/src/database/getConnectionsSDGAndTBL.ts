import { mapRecordToObject } from 'common/database';
import { ApiError } from 'types/types';
import DB from './index';
import getConnectionsSDGAndTBL from './queries/getConnectionsSDGAndTBL';

export default async (nodeId: string): Promise<Array<Node>> => {
  const query = getConnectionsSDGAndTBL(nodeId);
  if (!nodeId) {
    throw new ApiError(400, 'Could not parse ontology entity from the given class ID');
  }
  const response = await DB.query(query, { transform: 'toJSON' });
  return response.records.map(mapRecordToObject);
};
