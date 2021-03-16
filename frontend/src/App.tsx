import React from 'react';
import ErrorModal from './components/ErrorModal';
import Graph from './components/Graph';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DetailView from './components/DetailView';
import { Node } from './types/ontologyTypes';
import OntologyTable from './components/OntologyTable';
import './css/App.css';

const initialNode: Node = {
  prefix: {
    prefix: 'SDG',
    iri: 'http://www.semanticweb.org/aga/ontologies/2017/9/SDG#',
  },
  name: 'B11',
  id: 'http://www.semanticweb.org/aga/ontologies/2017/9/SDG#B11',
};

const App = () => (
  <div className="App">
    <Navbar />
    <Graph />
    <DetailView node={initialNode} />
    <OntologyTable />
    <ErrorModal />
    <Footer />
  </div>
);

export default App;
