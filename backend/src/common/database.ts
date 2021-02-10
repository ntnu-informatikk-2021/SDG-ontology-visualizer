import { OntologyEntity, Record, Ontology } from '../types';

export const parseIRI = (id: string): string => {
  const regex = /^[^_]*#/;
  return id.replace(regex, '');
};

export const mapIdToOntologyEntity = (id: string): OntologyEntity => ({
  name: parseIRI(id),
  id,
});

export const mapRecordToOntology = (record: Record): Ontology => ({
  Subject: record.Subject ? mapIdToOntologyEntity(record.Subject) : null,
  Object: record.Object ? mapIdToOntologyEntity(record.Object) : null,
  Predicate: mapIdToOntologyEntity(record.Predicate),
});
