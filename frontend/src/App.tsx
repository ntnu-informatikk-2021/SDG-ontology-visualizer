import React from 'react';
import { Provider } from 'react-redux';
import { ChakraProvider } from '@chakra-ui/react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import store from './state/store';
import ErrorModal from './components/atoms/ErrorModal';
import Navbar from './components/atoms/Navbar';
import Footer from './components/atoms/Footer';
import Frontpage from './components/pages/Frontpage';
import './css/App.css';
import About from './components/pages/About';
import OntologyPage from './components/pages/OntologyPage';

const App: React.FC = () => (
  <ChakraProvider>
    <Provider store={store}>
      <div className="App">
        <ErrorModal />
        <Router>
          <Navbar />
          <div className="content">
            <Switch>
              <Route path="/" exact component={Frontpage} />
              <Route path="/ontology/:prefix/:name" exact component={OntologyPage} />
              <Route path="/about" exact component={About} />
            </Switch>
          </div>
          <Footer />
        </Router>
      </div>
    </Provider>
  </ChakraProvider>
);

export default App;
