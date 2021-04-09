import DB from './index';
import { ApiError } from '../types/errorTypes';
import { Ontology } from '../types/ontologyTypes';
import getRelations from './queries/getRelations';
import {
  addEntityToNullFields,
  isNotLoopOntology,
  mapIdToNode,
  mapRecordToOntology,
} from '../common/database';

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
  const ontologies = response.records
    .map(mapRecordToOntology)
    .map((ont) => addEntityToNullFields(ont, node))
    .filter(isRelevantOntology)
    .filter(isNotLoopOntology);

  return ontologies;
};
