import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';

import Footer from '../../../components/atoms/Footer';
import store from '../../../state/store';

it('renders when there are no items', () => {
  const tree = renderer
    .create(
      <Provider store={store}>
        <Footer />
      </Provider>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
