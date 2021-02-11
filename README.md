# SDG Ontology Visualizer

A tool for visualizing ontologies related to UN's sustainable development goals

## How to setup

1. Clone the repo
2. run `yarn` in **both** backend and frontend folders
3. Download and install [Graph DB](https://www.ontotext.com/products/graphdb/graphdb-free/), and import an ontology. If you don't have an ontology you can use this [wine ontology sample](https://www.w3.org/TR/owl-guide/wine.rdf)
4. Run GraphDB and create a new user with access rights to your repository. Create a file named _.env_ in the server folder and paste the credentials from GraphDB. See _.env.example_.
5. Run yarn start both from /frontend/ and /backend/ to start both the web application as well as the Express server.
