import React from 'react';
import { Provider } from 'react-redux';
import { ChakraProvider } from '@chakra-ui/react';
import store from './state/store';
import ErrorModal from './components/ErrorModal';
import Graph from './components/Graph';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DetailView from './components/DetailView';
import { Node } from './types/ontologyTypes';
import OntologyTable from './components/OntologyTable';
import TestView from './components/TestView';
import './css/App.css';

const initialNode: Node = {
  prefix: {
    prefix: 'SDG',
    iri: 'http://www.semanticweb.org/aga/ontologies/2017/9/SDG#',
  },
  name: 'B4',
  id: 'http://www.semanticweb.org/aga/ontologies/2017/9/SDG#B4',
};

const testNode: Node = {
  prefix: {
    prefix: 'SDG',
    iri: 'http://www.semanticweb.org/aga/ontologies/2017/9/SDG#',
  },
  name: 'SDG',
  id: 'http://www.semanticweb.org/aga/ontologies/2017/9/SDG#SDG',
};

const App = () => (
  <ChakraProvider>
    <Provider store={store}>
      <div className="App">
        <Navbar />
        <Graph />
        <DetailView node={initialNode} />
        <OntologyTable />
        <TestView node={testNode} />
        <ErrorModal />
        <Footer />
      </div>
    </Provider>
  </ChakraProvider>
);

export default App;
