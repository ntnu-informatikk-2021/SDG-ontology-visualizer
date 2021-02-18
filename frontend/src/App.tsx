import React from 'react';
import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import OntologyTable from './components/OntologyTable';

const App = () => (
  <ChakraProvider>
    <div className="App">
      <OntologyTable />
    </div>
  </ChakraProvider>
);

export default App;
