import React from 'react';
import renderer from 'react-test-renderer';
import About from '../../../components/pages/About';

it('renders when there are no items', () => {
  const tree = renderer.create(<About />).toJSON();
  expect(tree).toMatchSnapshot();
});
