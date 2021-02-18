import React from 'react';
import './App.css';
import { Box, ChakraProvider } from '@chakra-ui/react';
import OntologyTable from './components/OntologyTable';

const App = () => (
  <ChakraProvider>
    <Box h="100vh">
      <div className="App">
        <OntologyTable />
      </div>
    </Box>
  </ChakraProvider>
);

export default App;
