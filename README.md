# SDG Ontology Visualizer

A tool for visualizing ontologies related to UN's sustainable development goals

[![Netlify Status](https://api.netlify.com/api/v1/badges/ae7d5c8b-7978-4f95-9b6b-fd1b40d40616/deploy-status)](https://app.netlify.com/sites/epic-ardinghelli-d1ee4d/deploys)

[![CI](https://github.com/ntnu-informatikk-2021/SDG-ontology-visualizer/actions/workflows/main.yml/badge.svg)](https://github.com/ntnu-informatikk-2021/SDG-ontology-visualizer/actions/workflows/main.yml)

[Deployed project](https://epic-ardinghelli-d1ee4d.netlify.app/)




## How to setup

1. Clone the repo
2. Run `yarn` in **both** backend and frontend folders
3. Create a file named _.env_ in the backend folder and paste your credentials as well as the IP of the server running GraphDB with port 7200. The structure of your _.env_ file can be copied from _.env.example_.
5. Run `yarn start` both in frontend and backend folders to start both the web application as well as the Express server.
