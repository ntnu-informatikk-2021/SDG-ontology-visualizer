import React from 'react';
import renderer from 'react-test-renderer';

import Footer from '../../../components/atoms/Footer';

it('renders when there are no items', () => {
  const tree = renderer.create(<Footer />).toJSON();
  expect(tree).toMatchSnapshot();
});
