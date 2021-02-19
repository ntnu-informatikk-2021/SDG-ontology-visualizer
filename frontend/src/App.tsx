import React from 'react';
import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import OntologyTable from './components/OntologyTable';
import ErrorModal from './components/ErrorModal';

const App = () => (
  <ChakraProvider>
    <div className="App">
      <OntologyTable />
      <ErrorModal />
    </div>
  </ChakraProvider>
);

export default App;
