import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';

import SustainabilityGoalsLists from '../../../components/molecules/SustainabilityGoalsList';
import store from '../../../state/store';

it('renders when there are no items', () => {
  const tree = renderer
    .create(
      <Provider store={store}>
        <SustainabilityGoalsLists />
      </Provider>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
