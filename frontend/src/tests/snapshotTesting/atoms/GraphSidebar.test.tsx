import React from 'react';
import renderer from 'react-test-renderer';
// eslint-disable-next-line import/extensions
import GraphSidebar from '../../../components/atoms/GraphSidebar';

it('renders when there are no items', () => {
  const tree = renderer.create(<GraphSidebar onSubgoalFilter={() => {}} />).toJSON();
  expect(tree).toMatchSnapshot();
});
