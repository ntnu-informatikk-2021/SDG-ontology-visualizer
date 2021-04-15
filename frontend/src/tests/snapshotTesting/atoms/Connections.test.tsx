import React from 'react';
import renderer from 'react-test-renderer';
import Connections from '../../../components/atoms/Connections';

const node1 = {
  id: 't1',
  name: 'he11i',
  type: 'ok11',
  prefix: {
    prefix: 'ja1jaa',
    iri: '121134',
  },
  correlation: 4,
};

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

it('renders when there are no items', () => {
  const tree = renderer
    .create(
      <>
        <Connections connections={[]} titles={[]} color="" handleOnClick={() => {}} />
      </>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders when there is one item', () => {
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

it('renders when there are two items', () => {
  const tree = renderer
    .create(
      <>
        <Connections
          connections={[node1, node2]}
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
