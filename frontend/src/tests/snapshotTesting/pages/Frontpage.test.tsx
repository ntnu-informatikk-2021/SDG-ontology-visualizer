import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import Frontpage from '../../../components/pages/Frontpage';
import store from '../../../state/store';

it('renders when there are no items', () => {
  const tree = renderer
    .create(
      <Provider store={store}>
        <Frontpage />
      </Provider>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
