import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import GraphContainer from '../../../components/molecules/GraphContainer';
import store from '../../../state/store';

it('renders when there are no items', () => {
  const tree = renderer
    .create(
      <Provider store={store}>
        <GraphContainer />
      </Provider>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
