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
  const prefixString = parsePrefixesToQuery(PREFIXES.SDG, PREFIXES.SCHEMA, PREFIXES.RDFS);

  return `
      ${prefixString}
      SELECT ?Subject ?Subjectlabel ?description
      WHERE { 
        ?Subject SDG:harBærekraftsmål ${fullNodeName}.
        optional{?Subject rdfs:label ?Subjectlabel}.
        optional{?Subject SDG:description ?description}
}`;
};
