import React from 'react';
import './css/App.css';
import { ChakraProvider } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import ErrorModal from './components/ErrorModal';
import store from './state/store';
import Graph from './components/Graph';
import Navbar from './components/Navbar';
import './App.css';
import Footer from './components/Footer';
import DetailView from './components/DetailView';
import { Node } from './types/ontologyTypes';
import OntologyTable from './components/OntologyTable';

const initialNode: Node = {
  prefix: {
    prefix: 'SDG',
    iri: 'http://www.semanticweb.org/aga/ontologies/2017/9/SDG#',
  },
  name: 'B11',
  id: 'http://www.semanticweb.org/aga/ontologies/2017/9/SDG#B11',
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
