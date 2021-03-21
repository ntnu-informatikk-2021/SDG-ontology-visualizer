import { PREFIXES } from '../index';
import { parsePrefixesToQuery } from '../../common/database';

export default (searchTerm: string, limitResults?: number): string => {
  const prefixes = parsePrefixesToQuery(PREFIXES.RDFS);

  return `
    ${prefixes}
    SELECT DISTINCT ?Subject ?SubjectLabel
    WHERE { 
        {
          ?Subject rdfs:label ?o .
          FILTER regex(?o, "${searchTerm}", "i") .
          OPTIONAL {?Subject rdfs:label ?SubjectLabel}
        }
        UNION
        {
          ?Subject ?p ?o .
          FILTER regex(str(?Subject), "${searchTerm}", "i") .
          OPTIONAL {?Subject rdfs:label ?SubjectLabel}
        }
      
    } LIMIT ${limitResults ? Math.min(limitResults, 200) : 20}
  `;
};
