import React from 'react';
import renderer from 'react-test-renderer';
import ContextDivider from '../../../components/atoms/ContextDivider';

it('renders when there are no items', () => {
  const tree = renderer.create(<ContextDivider visible />).toJSON();
  expect(tree).toMatchSnapshot();
});
