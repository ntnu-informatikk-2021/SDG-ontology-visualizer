import React from 'react';
import { Provider } from 'react-redux';
import OntologyTable from './components/OntologyTable';
import ErrorModal from './components/ErrorModal';
import store from './state/store';
import Graph from './components/Graph';
import Navbar from './components/Navbar';
import './App.css';
import Footer from './components/Footer';
import DetailView from './components/DetailView';
import { Node } from './types/ontologyTypes';

const initialNode: Node = {
  prefix: {
    prefix: 'SDG',
    iri: 'http://www.semanticweb.org/aga/ontologies/2017/9/SDG#',
  },
  name: 'Miljø',
  id: 'http://www.semanticweb.org/aga/ontologies/2017/9/SDG#Miljø',
};

const App = () => (
  <Provider store={store}>
    <div className="App">
      <Navbar />
      <Graph />
      <DetailView node={initialNode} />
      <OntologyTable />
      <ErrorModal />
      <Footer />
    </div>
  </Provider>
);

export default App;
