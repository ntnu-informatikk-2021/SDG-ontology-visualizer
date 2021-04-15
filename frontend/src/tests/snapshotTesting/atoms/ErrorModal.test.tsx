import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import ErrorModal from '../../../components/atoms/ErrorModal';
import store from '../../../state/store';

it('renders when there are no items', () => {
  const tree = renderer
    .create(
      <Provider store={store}>
        <ErrorModal />
      </Provider>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
