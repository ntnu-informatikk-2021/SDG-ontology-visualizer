import { OntologyEntity, Record, Ontology } from '../types/types';

export const parseIRI = (id: string): string => {
  const regex = /^[^_]*#/;
  const name = id.replace(regex, '');
  if (!name || name === id) return '';
  return name;
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
