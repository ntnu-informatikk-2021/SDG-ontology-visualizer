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
    SELECT ?description
    WHERE { 
       ${fullClassName} rdfs:comment ?description
  }`;
};
