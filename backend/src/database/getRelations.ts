import DB from './index';
import { ApiError, Ontology } from '../types/types';
import getRelations from './queries/getRelations';
import {
  addEntityToNullFields,
  mapIdToOntologyEntity,
  mapRecordToOntology,
} from '../common/database';

const isRelevantOntology = (ontology: Ontology): boolean => {
  if (!ontology || !ontology.Predicate || !(ontology.Subject || ontology.Object)) return false;
  if (ontology.Predicate.id.includes('#type')) return false;
  const ontologyEntity = ontology.Subject || ontology.Object;
  if (!ontologyEntity || ontologyEntity.id.includes('node')) return false;
  if (ontology.Predicate.id.includes('hasWineDescriptor')) return false;
  return true;
};

export default async (classId: string): Promise<Array<Ontology>> => {
  const ontologyEntity = mapIdToOntologyEntity(classId);
  if (!ontologyEntity) {
    throw new ApiError(400, 'Could not parse ontology entity from the given class ID');
  }
  const query = getRelations(classId);
  const response = await DB.query(query, { transform: 'toJSON' });
  const ontologies = response.records
    .map(mapRecordToOntology)
    .map((ont) => addEntityToNullFields(ont, ontologyEntity))
    .filter(isRelevantOntology);
  return ontologies;
};
