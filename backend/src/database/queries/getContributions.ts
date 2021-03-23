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
      SDG:B1 SDG:harBidragTil ?Object.
      ?Object rdfs:label ?ObjectLabel
      Optional {
        ?Object SDG:harHøyKorrelasjon SDG:B1.
        ?Object rdfs:label ?HarHøyKorrelasjon }

     Optional {
      ?Object SDG:harModeratKorrelasjon SDG:B1.
      ?Object rdfs:label ?HarModeratKorrelasjon }
  
     Optional {
      ?Object SDG:harLavKorrelasjon SDG:B1.
      ?Object rdfs:label ?HarLavKorrelasjon }
  

  }`;
};
