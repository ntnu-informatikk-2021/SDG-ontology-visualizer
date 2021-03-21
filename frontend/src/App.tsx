import React from 'react';
import { Provider } from 'react-redux';
import { Box, ChakraProvider } from '@chakra-ui/react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import store from './state/store';
import ErrorModal from './components/atoms/ErrorModal';
import Navbar from './components/atoms/Navbar';
import Footer from './components/atoms/Footer';
import Frontpage from './components/pages/Frontpage';
import About from './components/pages/About';
import OntologyPage from './components/pages/OntologyPage';
import NotFoundPage from './components/pages/NotFound';

const App: React.FC = () => (
  <ChakraProvider>
    <Provider store={store}>
      <Box m={0} minHeight="100vh">
        <Router>
          <ErrorModal />
          <Navbar />
          <Box>
            <Switch>
              <Route path="/" exact component={Frontpage} />
              <Route path="/ontology" exact component={OntologyPage} />
              <Route path="/about" exact component={About} />
              <Route component={NotFoundPage} />
            </Switch>
          </Box>
          <Footer />
        </Router>
      </Box>
    </Provider>
  </ChakraProvider>
);

export default App;
