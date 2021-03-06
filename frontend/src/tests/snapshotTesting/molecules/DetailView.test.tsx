import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import DetailView from '../../../components/molecules/DetailView';
import store from '../../../state/store';

it('renders when there are no items', () => {
  const tree = renderer
    .create(
      <Provider store={store}>
        <DetailView />
      </Provider>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
