import React from 'react';
import renderer from 'react-test-renderer';
import GraphSidebar from '../../../components/atoms/GraphSidebar';

const sidebar = {
  id: 't2',
};

it('renders when there are no items', () => {
  const tree = renderer
    .create(
      <GraphSidebar
        onSubgoalFilter={() => {
          console.log(sidebar);
        }}
      />,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
