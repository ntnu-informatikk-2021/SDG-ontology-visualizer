import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import renderer from 'react-test-renderer';
import SearchBar from '../../../components/atoms/SearchBar';
import store from '../../../state/store';

it('renders when there are no items', () => {
  const tree = renderer
    .create(
      <Provider store={store}>
        <Router>
          <SearchBar />
        </Router>
      </Provider>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
