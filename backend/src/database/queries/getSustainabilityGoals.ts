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
      PREFIX schema: <http://schema.org/>
      SELECT ?instancesOf ?label ?icon
      WHERE { 
        ?instancesOf  rdf:type  ${fullClassName}.
        ?instancesOf  rdfs:label  ?label.
        ?instancesOf  schema:icon  ?icon.
          FILTER NOT EXISTS { 
           ?instancesOf rdf:type ?c . 
           ?c rdfs:subClassOf + ${fullClassName}  .
           FILTER (?c != ${fullClassName} )  
      }
    } `;
};
