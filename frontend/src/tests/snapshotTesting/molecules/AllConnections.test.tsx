import React from 'react';
import renderer from 'react-test-renderer';
import AllConnections from '../../../components/molecules/AllConnections';

const node1 = {
  id: 't1',
  name: 'heihei',
  type: 'ok1oki',
  prefix: {
    prefix: 'jaaajaa',
    iri: '123456',
  },
  correlation: 2,
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
      <AllConnections contributions={[]} tradeOffs={[]} developmentAreas={[]} onClick={() => {}} />,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders when there are one item', () => {
  const tree = renderer
    .create(
      <AllConnections
        contributions={[node2]}
        tradeOffs={[node2]}
        developmentAreas={[node2]}
        onClick={() => {}}
      />,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders when there are two items', () => {
  const tree = renderer
    .create(
      <AllConnections
        contributions={[node1, node2]}
        tradeOffs={[node1, node2]}
        developmentAreas={[node1, node2]}
        onClick={() => {}}
      />,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
