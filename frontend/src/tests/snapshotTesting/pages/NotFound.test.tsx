import React from 'react';
import renderer from 'react-test-renderer';

import NotFound from '../../../components/pages/NotFound';

it('renders when there are no items', () => {
  const tree = renderer.create(<NotFound />).toJSON();
  expect(tree).toMatchSnapshot();
});
