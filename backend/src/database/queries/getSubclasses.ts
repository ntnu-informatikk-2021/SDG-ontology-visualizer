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
    ?directSub rdfs:subClassOf ${fullClassName} .
    FILTER NOT EXISTS { 
      ?otherSub rdfs:subClassOf ${fullClassName} . 
      ?directSub rdfs:subClassOf ?otherSub .
      FILTER (?otherSub != ?directSub)
    }
  }`;
};
