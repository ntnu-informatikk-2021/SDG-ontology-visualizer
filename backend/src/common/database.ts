import { Prefix } from '@innotrade/enapso-graphdb-client';
import { Node, OntologyEntity, Record, Ontology, Edge } from '../types/ontologyTypes';

const getCorrelationIndexFromRecord = (record: Record): number => {
  if (record.High) return 3;
  if (record.Moderate) return 2;
  if (record.Low) return 1;
  return 0;
};

export const parseNameFromClassId = (id: string): string => {
  const regex = /^[^_]*#/;
  const name = id.replace(regex, '');
  if (!name || name === id) return '';
  return name;
};

export const parsePrefixFromClassId = (id: string): Prefix | null => {
  const prefixRegex = /(?<=\/)([^/]*)(?=#)/;
  const prefixMatches = id.match(prefixRegex);
  if (!prefixMatches || !prefixMatches[0]) return null;

  const iriRegex = /^[^_]*#/;
  const iriMatches = id.match(iriRegex);
  if (!iriMatches || !iriMatches[0]) return null;

  return {
    prefix: prefixMatches[0],
    iri: iriMatches[0],
  };
};

export const mapIdToOntologyEntity = (id: string): OntologyEntity | null => {
  const prefix = parsePrefixFromClassId(id);
  const name = parseNameFromClassId(id);
  if (!prefix || !name) return null;
  return {
    prefix,
    name,
    id,
  };
};

export const mapIdToNode = (id: string, correlation?: number, type?: string): Node | null => {
  const ontologyEntity = mapIdToOntologyEntity(id);
  if (!ontologyEntity) return null;
  return {
    prefix: ontologyEntity.prefix,
    name: ontologyEntity.name,
    id: ontologyEntity.id,
    type: type || 'undefined',
    correlation: correlation || 0,
  };
};

export const mapIdToEdge = (id: string): Edge | null => {
  const ontologyEntity = mapIdToOntologyEntity(id);
  let correlation = 0;
  if (!ontologyEntity) return null;
  if (ontologyEntity.name.includes('HøyK')) correlation = 3;
  if (ontologyEntity.name.includes('ModeratK')) correlation = 2;
  if (ontologyEntity.name.includes('LavK')) correlation = 1;
  if (ontologyEntity.name.includes('LavT')) correlation = -1;
  if (ontologyEntity.name.includes('ModeratT')) correlation = -2;
  if (ontologyEntity.name.includes('HøyT')) correlation = -3;
  return {
    prefix: ontologyEntity.prefix,
    name: ontologyEntity.name,
    id: ontologyEntity.id,
    correlation: correlation,
  };
};

export const mapRecordToOntology = (record: Record): Ontology => {
  let subject = record.Subject ? mapIdToNode(record.Subject) : null;
  if (subject && record.SubjectLabel) {
    if (record.TypeLabel)
      subject = { ...subject, name: record.SubjectLabel, type: record.TypeLabel };
    subject = { ...subject, name: record.SubjectLabel };
  }
  let object = record.Object ? mapIdToNode(record.Object) : null;
  if (object && record.ObjectLabel) {
    if (record.TypeLabel) object = { ...object, name: record.ObjectLabel, type: record.TypeLabel };
    object = { ...object, name: record.ObjectLabel };
  }
  return {
    Subject: subject,
    Object: object,
    Predicate: mapIdToEdge(record.Predicate),
  };
};

export const mapRecordToObject = (record: Record): Node | null => {
  const correlation = getCorrelationIndexFromRecord(record);
  let object = record.Object ? mapIdToNode(record.Object, correlation) : null;
  if (object && record.ObjectLabel) {
    object = { ...object, name: record.ObjectLabel };
  }
  return object;
};

export const mapRecordToSubject = (record: Record): Node | null => {
  let subject = record.Subject ? mapIdToNode(record.Subject) : null;
  if (subject && record.SubjectLabel) {
    subject = { ...subject, name: record.SubjectLabel };
  }
  return subject;
};

export const parseOntologyEntityToQuery = (entity: OntologyEntity): string =>
  `${entity.prefix.prefix}:${entity.name}`;

export const parsePrefixesToQuery = (...prefixes: Prefix[]): string => {
  const strings = prefixes.map((p) => `PREFIX ${p.prefix}: <${p.iri}>`);
  return strings.join('\n');
};

export const addEntityToNullFields = (ontology: Ontology, entity: Node): Ontology => ({
  Subject: ontology.Subject || entity,
  Predicate: ontology.Predicate,
  Object: ontology.Object || entity,
});
export const removeDuplicatePredicates = (ontology: any, sameOntology: any): any => {
  ontology.forEach((Ontology, index) => {
    sameOntology.forEach((SameOntology, index1) => {
      if (
        Ontology.Object.name === SameOntology.Object.name &&
        Ontology.Subject.name === SameOntology.Subject.name &&
        Ontology.Predicate.name !== SameOntology.Predicate.name
      )
        if (SameOntology.Predicate.correlation === 0) ontology.splice(index1, 1);
    });
    if (Ontology.Predicate.correlation === 0) ontology.splice(index, 1);
  });
  return {
    Subject: ontology.Subject,
    Predicate: ontology.Predicate,
    Object: ontology.Object,
  };
};

export const isNotLoopOntology = (ontology: Ontology): boolean =>
  ontology.Subject !== ontology.Object;

export const isNotNull = <T>(obj: T): boolean => obj !== null && obj !== undefined;
