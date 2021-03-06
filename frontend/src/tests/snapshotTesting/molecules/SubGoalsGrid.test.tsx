import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import SubGoalsGrid from '../../../components/molecules/SubGoalsGrid';
import store from '../../../state/store';

it('renders when there are no items', () => {
  const tree = renderer
    .create(
      <Provider store={store}>
        <SubGoalsGrid />
      </Provider>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
