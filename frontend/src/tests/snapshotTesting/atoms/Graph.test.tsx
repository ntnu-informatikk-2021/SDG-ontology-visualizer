import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import Graph from '../../../components/atoms/Graph';
import store from '../../../state/store';

it('renders when there are no items', () => {
  const tree = renderer
    .create(
      <Provider store={store}>
        <Graph nodeFilter={() => true} />
      </Provider>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
