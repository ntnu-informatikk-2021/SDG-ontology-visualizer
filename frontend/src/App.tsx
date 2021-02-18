import React from 'react';
import { RecoilRoot } from 'recoil';
import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import OntologyTable from './components/OntologyTable';
import ErrorModal from './components/ErrorModal';

const App = () => (
  <RecoilRoot>
    <ChakraProvider>
      <div className="App">
        <OntologyTable />
        <ErrorModal />
      </div>
    </ChakraProvider>
  </RecoilRoot>
);

export default App;
