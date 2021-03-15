import React from 'react';
import './css/App.css';
import { ChakraProvider } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import ErrorModal from './components/ErrorModal';
import store from './state/store';
import Graph from './components/Graph';

const App = () => (
  <Provider store={store}>
    <ChakraProvider>
      <div className="App">
        <Graph />
        <ErrorModal />
      </div>
    </ChakraProvider>
  </Provider>
);

export default App;
