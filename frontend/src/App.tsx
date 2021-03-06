import React from 'react';
import { Provider } from 'react-redux';
import OntologyTable from './components/OntologyTable';
import ErrorModal from './components/ErrorModal';
import store from './state/store';
import Graph from './components/Graph';
import Navbar from './components/Navbar';
import './App.css';
import Footer from './components/Footer';

const App = () => (
  <Provider store={store}>
    <div className="App">
      <Navbar />
      <Graph />
      <OntologyTable />
      <ErrorModal />
      <Footer />
    </div>
  </Provider>
);

export default App;
