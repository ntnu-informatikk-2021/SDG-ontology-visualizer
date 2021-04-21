import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import GraphToolbar from '../../../components/molecules/GraphToolbar';
import store from '../../../state/store';

it('renders when there are no items', () => {
  const tree = renderer
    .create(
      <Provider store={store}>
        <GraphToolbar onSubgoalFilter={() => {}} />
      </Provider>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
