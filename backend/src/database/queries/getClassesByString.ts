import { PREFIXES } from '../index';
import { parsePrefixesToQuery } from '../../common/database';

export default (searchTerm: string, limitResults?: number): string => {
  const prefixes = parsePrefixesToQuery(PREFIXES.RDFS);

  return `
    ${prefixes}
    SELECT DISTINCT ?Subject
    WHERE { 
        {
          ?Subject rdfs:label ?o .
          FILTER regex(?o, "${searchTerm}", "i") .
        }
        UNION
        {
          ?Subject ?p ?o .
          FILTER regex(str(?Subject), "${searchTerm}", "i")
        }
      
    } LIMIT ${limitResults ? Math.min(limitResults, 200) : 20}
  `;
};
