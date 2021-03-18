import React from 'react';
import { Provider } from 'react-redux';
import { ChakraProvider } from '@chakra-ui/react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import store from './state/store';
import ErrorModal from './components/ErrorModal';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Frontpage from './pages/Frontpage';
import './css/App.css';
import About from './pages/About';
import OntologyPage from './pages/OntologyPage';

const App = () => (
  <ChakraProvider>
    <Provider store={store}>
      <div className="App">
        <ErrorModal />
        <div className="content">
          <Navbar />
          <Router>
            <Switch>
              <Route path="/" exact component={Frontpage} />
              <Route path="/ontology" exact component={OntologyPage} />
              <Route path="/about" exact component={About} />
            </Switch>
          </Router>
        </div>
        <Footer />
      </div>
    </Provider>
  </ChakraProvider>
);

export default App;
