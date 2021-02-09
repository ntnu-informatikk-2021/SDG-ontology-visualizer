// const { EnapsoGraphDBClient } = require("@innotrade/enapso-graphdb-client");
import { EnapsoGraphDBClient } from '@innotrade/enapso-graphdb-client';


const GRAPHDB_BASE_URL = "http://localhost:7200",
GRAPHDB_REPOSITORY = "wineTest",
GRAPHDB_USERNAME = "testuser",
GRAPHDB_PASSWORD = "testpass",
GRAPHDB_CONTEXT_TEST = "http://ont.enapso.com/repo";

const DEFAULT_PREFIXES = [
    EnapsoGraphDBClient.PREFIX_OWL,
    EnapsoGraphDBClient.PREFIX_RDF,
    EnapsoGraphDBClient.PREFIX_RDFS,
    EnapsoGraphDBClient.PREFIX_XSD,
    EnapsoGraphDBClient.PREFIX_PROTONS,
    {
        prefix: "Testing",
        iri: "http://ont.enapso.com/Node1#",
    }
];

const graphDBEndpoint = new EnapsoGraphDBClient.Endpoint({
    baseURL: GRAPHDB_BASE_URL,
    repository: GRAPHDB_REPOSITORY,
    prefixes: DEFAULT_PREFIXES
});



const getName = (id) => {
    const regex = /^[^_]*#/;
    return id.replace(regex, '');
}

const mapIdToObject = (id) => {
    return {
        name: getName(id),
        id,
    }
}

const isRelevantOntology = (ontology) => {
    if (!ontology || !ontology.Predicate || !(ontology.Subject || ontology.Object)) return false;
    if (ontology.Predicate.includes('#type')) return false;
    const ontologyEntity = ontology.Subject || ontology.Object;
    if (ontologyEntity.includes('node')) return false;
    if (ontology.Predicate.includes('hasWineDescriptor')) return false;
    return true;
}

const mapRecordToObject = (record) => {
    const output = {};
    Object.keys(record).forEach((key) => {
        output[key] = mapIdToObject(record[key]);
    });
    return output;
}

const removeDuplicates = (ontologies, queriedName) => {
    const usedNames = [];
    return ontologies.filter(ont => {
        if (ont.Subject) {
            if (usedNames.includes(ont.Subject.name)) return false;
            usedNames.push(ont.Subject.name);
        } else {
            if (usedNames.includes(ont.Object.name)) return false;
            usedNames.push(ont.Object.name);
        }
        return true;
    });
}

export const login = () => {
    graphDBEndpoint.login(GRAPHDB_USERNAME,GRAPHDB_PASSWORD)
        .then((result) => {
            console.log(result);
        }).catch((err) => {
            console.log(err);
        });
}

export const getRelations = async (className) => {
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

    const response = await graphDBEndpoint.query(query, { transform: "toJSON" });
    const foo = response.records
        .filter(isRelevantOntology)
        .map(mapRecordToObject);
    return removeDuplicates(foo, className);
}

export const readAllClasses = async () => {
    const query = `
        select ?class
        where {
            ?class a owl:Class .
        }`;

    return await graphDBEndpoint.query(query, { transform: "toJSON" });
}

export const insertClass = () => {
    const query = `
        insert data {
            graph <${GRAPHDB_CONTEXT_TEST}> {
                Testing:Hello rdf:type owl:Class
            }
        }`;

    graphDBEndpoint
        .update(query)
        .then((result) => {
            console.log("inserted a class :\n" + JSON.stringify(result, null, 2));
        })
        .catch((err) => {
            console.log(err);
        });
}