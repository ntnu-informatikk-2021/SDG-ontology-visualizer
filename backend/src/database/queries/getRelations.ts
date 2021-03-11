import {
  mapIdToOntologyEntity,
  parseOntologyEntityToQuery,
  parsePrefixesToQuery,
} from '../../common/database';
import { PREFIXES } from '../index';

export default (classId: string): string => {
  const node = mapIdToOntologyEntity(classId);
  if (!node) return '';

  const fullClassName = parseOntologyEntityToQuery(node);
  const prefixString = parsePrefixesToQuery(node.prefix, PREFIXES.RDFS);

  return `
  ${prefixString}
  SELECT *
  WHERE {
    {
      ${fullClassName} ?Predicate ?Object .
      OPTIONAL {?Object rdfs:label ?ObjectLabel}
    }
    UNION
    {
      ?Subject ?Predicate ${fullClassName} .
      OPTIONAL {?Subject rdfs:label ?SubjectLabel}
    }
  }`;
};
