import DB from './index';
import getDescription from './queries/getDescription';

export default async (classId: string): Promise<string> => {
  const query = getDescription(classId);
  const response = await DB.query(query, { transform: 'toJSON' });
  return response.records[0].description;
};
