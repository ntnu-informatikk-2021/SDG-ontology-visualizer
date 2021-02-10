import { EnapsoGraphDBClient } from '@innotrade/enapso-graphdb-client';
import { Edge, Node, Ontology, Record } from 'types';
import config from './config';

const graphDBEndpoint = new EnapsoGraphDBClient.Endpoint({
  baseURL: config.GRAPHDB_BASE_URL,
  repository: config.GRAPHDB_REPOSITORY,
  prefixes: config.DEFAULT_PREFIXES,
});

const getName = (id: string): string => {
  const regex = /^[^_]*#/;
  return id.replace(regex, '');
};

const mapIdToObject = (id: string): Node | Edge => {
  return {
    name: getName(id),
    id,
  };
};

const isRelevantOntology = (ontology: Ontology): boolean => {
  if (!ontology || !ontology.Predicate || !(ontology.Subject || ontology.Object)) return false;
  if (ontology.Predicate.id.includes('#type')) return false;
  const ontologyEntity = ontology.Subject || ontology.Object;
  if (!ontologyEntity || ontologyEntity.id.includes('node')) return false;
  if (ontology.Predicate.id.includes('hasWineDescriptor')) return false;
  return true;
};

const mapRecordToObject = (record: Record): Ontology => {
  return {
    Subject: record.Subject ? mapIdToObject(record.Subject) : null,
    Object: record.Object ? mapIdToObject(record.Object) : null,
    Predicate: mapIdToObject(record.Predicate),
  };
};

const removeDuplicates = (ontologies: Array<Ontology>, queriedName: string): Array<Ontology> => {
  const usedNames: Array<string> = [];
  return ontologies.filter((ont) => {
    if (ont.Subject) {
      if (usedNames.includes(ont.Subject.name)) return false;
      usedNames.push(ont.Subject.name);
    } else if (ont.Object) {
      if (usedNames.includes(ont.Object.name)) return false;
      usedNames.push(ont.Object.name);
    } else {
      console.log('this shouldnt happen...');
      return false;
    }
    return true;
  });
};

export const login = (): void => {
  graphDBEndpoint
    .login(config.GRAPHDB_USERNAME, config.GRAPHDB_PASSWORD)
    .then((result: any) => {
      console.log(result);
    })
    .catch((err: any) => {
      console.log(err);
    });
};

export const getRelations = async (className: string): Promise<Array<Ontology>> => {
  const query = `
        PREFIX : <http://www.w3.org/TR/2003/PR-owl-guide-20031209/wine#>
        SELECT *
        WHERE {
            {
                ${className} ?Predicate ?Object
            }
            UNION
            {
                ?Subject ?Predicate ${className}
            }
        } `;

  const response = await graphDBEndpoint.query(query, { transform: 'toJSON' });
  const foo = response.records.map(mapRecordToObject).filter(isRelevantOntology);
  return removeDuplicates(foo, className);
};
