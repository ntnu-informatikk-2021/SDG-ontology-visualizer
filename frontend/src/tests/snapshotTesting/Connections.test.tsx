import React from 'react';
import renderer from 'react-test-renderer';
import Connections from '../../components/atoms/Connections';

const node2 = {
  id: 't2',
  name: 'hei',
  type: 'ok1',
  prefix: {
    prefix: 'jajaa',
    iri: '1234',
  },
  correlation: 3,
};

// const nodes = [node1, node2];

it('renders when there are no items', () => {
  const tree = renderer
    .create(
      <>
        <Connections
          connections={[node2]}
          titles={['Har positiv virkning til:', 'Har ingen etablerte positive påvirkninger enda']}
          color="green"
          handleOnClick={() => {
            console.log(node2);
          }}
        />
      </>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
