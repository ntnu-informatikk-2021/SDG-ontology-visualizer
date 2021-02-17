import { Prefix } from '@innotrade/enapso-graphdb-client';
import { OntologyEntity, Record, Ontology } from '../types/types';

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

export const mapRecordToOntology = (record: Record): Ontology => ({
  Subject: record.Subject ? mapIdToOntologyEntity(record.Subject) : null,
  Object: record.Object ? mapIdToOntologyEntity(record.Object) : null,
  Predicate: mapIdToOntologyEntity(record.Predicate),
});

export const parseOntologyEntityToQuery = (entity: OntologyEntity): string =>
  `${entity.prefix.prefix}:${entity.name}`;

export const parsePrefixesToQuery = (...prefixes: Prefix[]): string => {
  const strings = prefixes.map((p) => `PREFIX ${p.prefix}: <${p.iri}>`);
  return strings.join('\n');
};
