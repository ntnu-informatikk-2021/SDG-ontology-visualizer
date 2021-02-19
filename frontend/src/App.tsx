import React from 'react';
import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import OntologyTable from './components/OntologyTable';
import ErrorModal from './components/ErrorModal';
import store from './state/store';

const App = () => (
  <Provider store={store}>
    <ChakraProvider>
      <div className="App">
        <OntologyTable />
        <ErrorModal />
      </div>
    </ChakraProvider>
  </Provider>
);

export default App;
