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
    PREFIX rdfs1: <http://www.semanticweb.org/aga/ontologies/2017/9/SDG#rdfs:>
    PREFIX : <http://www.semanticweb.org/aga/ontologies/2017/9/SDG#:>
    PREFIX schema: <http://schema.org/>
    select *
    where { 
    { 
         ${fullClassName} rdfs:label ?label.
         ${fullClassName} rdfs1:description ?description.
         SDG:Miljø rdfs:label ?relation
    }
   } `;
};
