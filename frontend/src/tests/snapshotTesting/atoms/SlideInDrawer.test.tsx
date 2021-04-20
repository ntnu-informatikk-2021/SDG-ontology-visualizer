import React from 'react';
import renderer from 'react-test-renderer';

import SlideInDrawer from '../../../components/atoms/SlideInDrawer';

it('renders when there are no items', () => {
  const tree = renderer
    .create(
      <SlideInDrawer expanded width="10px">
        <></>
      </SlideInDrawer>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
