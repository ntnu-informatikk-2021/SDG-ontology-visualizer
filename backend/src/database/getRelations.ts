import {
  addEntityToNullFields,
  filterDuplicatePredicates,
  isNotLoopOntology,
  mapIdToNode,
  mapRecordToOntology,
} from '../common/database';
import { ApiError } from '../types/errorTypes';
import { Ontology, Record } from '../types/ontologyTypes';
import DB from './index';
import getRelations from './queries/getRelations';

const isRelevantOntology = (ontology: Ontology): boolean => {
  if (!ontology || !ontology.Predicate || !(ontology.Subject || ontology.Object)) return false;
  if (ontology.Predicate.id.includes('#type')) return false;
  const node = ontology.Subject || ontology.Object;
  if (!node || node.id.includes('node')) return false;
  return true;
};

export default async (classId: string): Promise<Array<Ontology>> => {
  const node = mapIdToNode(classId);
  if (!node) {
    throw new ApiError(400, 'Could not parse node from the given class ID');
  }
  const query = getRelations(classId);
  const response = await DB.query(query, { transform: 'toJSON' });
  const records = response.records as Array<Record>;
  const ontologies = records
    .map(mapRecordToOntology)
    .map((ont) => addEntityToNullFields(ont, node))
    .filter(isRelevantOntology)
    .filter(isNotLoopOntology)
    .filter(filterDuplicatePredicates);

  return ontologies;
};
