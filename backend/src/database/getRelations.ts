import DB from './index';
import { Ontology } from '../types/types';
import getRelations from './queries/getRelations';
import { mapRecordToOntology } from '../common/database';

const isRelevantOntology = (ontology: Ontology): boolean => {
  if (!ontology || !ontology.Predicate || !(ontology.Subject || ontology.Object)) return false;
  if (ontology.Predicate.id.includes('#type')) return false;
  const ontologyEntity = ontology.Subject || ontology.Object;
  if (!ontologyEntity || ontologyEntity.id.includes('node')) return false;
  if (ontology.Predicate.id.includes('hasWineDescriptor')) return false;
  return true;
};

export default async (classId: string): Promise<Array<Ontology>> => {
  const query = getRelations(classId);
  const response = await DB.query(query, { transform: 'toJSON' });
  return response.records.map(mapRecordToOntology).filter(isRelevantOntology);
};
