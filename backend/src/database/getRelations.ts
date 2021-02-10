import DB from './index';
import { Ontology, Node, Edge, Record, OntologyEntity } from '../types';
import getRelations from './queries/getRelations';

const parseIRI = (id: string): string => {
  const regex = /^[^_]*#/;
  return id.replace(regex, '');
};

const mapIdToOntologyEntity = (id: string): OntologyEntity => {
  return {
    name: parseIRI(id),
    id,
  };
};

const isRelevantOntology = (ontology: Ontology): boolean => {
  if (!ontology || !ontology.Predicate || !(ontology.Subject || ontology.Object)) return false;
  if (ontology.Predicate.id.includes('#type')) return false;
  const ontologyEntity = ontology.Subject || ontology.Object;
  if (!ontologyEntity || ontologyEntity.id.includes('node')) return false;
  if (ontology.Predicate.id.includes('hasWineDescriptor')) return false;
  return true;
};

const mapRecordToObject = (record: Record): Ontology => {
  return {
    Subject: record.Subject ? mapIdToOntologyEntity(record.Subject) : null,
    Object: record.Object ? mapIdToOntologyEntity(record.Object) : null,
    Predicate: mapIdToOntologyEntity(record.Predicate),
  };
};

const removeDuplicates = (ontologies: Array<Ontology>): Array<Ontology> => {
  const usedNames: Array<string> = [];
  return ontologies.filter((ont) => {
    if (ont.Subject) {
      if (usedNames.includes(ont.Subject.name)) return false;
      usedNames.push(ont.Subject.name);
    } else if (ont.Object) {
      if (usedNames.includes(ont.Object.name)) return false;
      usedNames.push(ont.Object.name);
    } else {
      console.log('this shouldnt happen...');
      return false;
    }
    return true;
  });
};

export default async (className: string): Promise<Array<Ontology>> => {
  const query = getRelations(className);
  const response = await DB.query(query, { transform: 'toJSON' });
  const ontologies = response.records.map(mapRecordToObject).filter(isRelevantOntology);
  return removeDuplicates(ontologies);
};
