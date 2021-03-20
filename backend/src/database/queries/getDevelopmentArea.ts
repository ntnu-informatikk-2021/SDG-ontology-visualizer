import {
  mapIdToOntologyEntity,
  parseOntologyEntityToQuery,
  parsePrefixesToQuery,
} from '../../common/database';
import { PREFIXES } from '../index';

export default (nodeId: string): string => {
  const node = mapIdToOntologyEntity(nodeId);
  if (!node) return '';

  const fullNodeName = parseOntologyEntityToQuery(node);
  const prefixString = parsePrefixesToQuery(node.prefix, PREFIXES.RDFS);
  // TODO: Change "erUtviklingsområdeFor" to "erUtviklingsOmrådeFor" in the ontology!
  return `
      ${prefixString}
      SELECT *
      WHERE {
        {
          ${fullNodeName} SDG:harUtviklingsOmråde ?Object .
          OPTIONAL {?Object rdfs:label ?ObjectLabel}
        }
      Union {
        ${fullNodeName} SDG:erUtviklingsområdeFor ?Object .
        OPTIONAL {?Object rdfs:label ?ObjectLabel}
      }  
      }`;
};
