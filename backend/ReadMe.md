# Backend

## SPARQL - queries
As the ontology is built up by the subject,predicate,object-structure the queries required to extract the information contained in GraphDB is based on SPARQL.
SPARQL is a query language based on the subject,predicate,object-structure, called the RDF language. This query language is more advanced than that of \textit{SQL} - queries,
however the associated possibilities is larger.

### src/innotrade/enapso-graphdb-client
Enapso-graphdb-client is a third party component used to establish a connection between the backend and GraphDB in our tecknology stack. This component parses the assosiated prefixes both 
pre-exsisting once in the RDF language along with a prefix defined specificly for our developed ontology. 

### src/common/index.ts
The index.ts file uses the enapso-graphdb-client compoent in order to standarised all assosiated queries with the nessescary Prefixes. This includes standarsied Prefixes within the RDF language along
with a Prefix for our ontology.

### src/common/database/queries
The queries folder contains all queries used for our tecknology stack and visualisation of the ontology in frontend. These queries uses the standarised Prefix variable from `src/common/index.ts`
and follows the general SPARQL syntax.

### src/common/database
Each induvidual query has its assosiated recording file, named accordingly. These record files handles the respons from GraphDB and furthermore converts the respons into correct types 
defined in: `src/OntologyTypes.ts`

