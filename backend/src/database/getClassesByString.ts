import DB from './index';
import { Node } from '../types/types';
import getClassesByString from './queries/getClassesByString';
import { mapRecordToSubject } from '../common/database';

export default async (searchTerm: string, limitResults?: number): Promise<Array<Node>> => {
  const query = getClassesByString(searchTerm, limitResults);
  const response = await DB.query(query, { transform: 'toJSON' });
  return response.records.map(mapRecordToSubject);
};
