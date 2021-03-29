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

  return `
    ${prefixString}
    SELECT *
    WHERE { 
      ${fullNodeName} SDG:harBidragTil ?Object.
      ?Object rdfs:label ?ObjectLabel
      Optional {
        ?Object SDG:harHøyKorrelasjon ${fullNodeName}.
        ?Object rdfs:label ?High }

     Optional {
      ?Object SDG:harModeratKorrelasjon ${fullNodeName}.
      ?Object rdfs:label ?Moderate }
  
     Optional {
      ?Object SDG:harLavKorrelasjon ${fullNodeName}.
      ?Object rdfs:label ?Low }
  

  }`;
};
