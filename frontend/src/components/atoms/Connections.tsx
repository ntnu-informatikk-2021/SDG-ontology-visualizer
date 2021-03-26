import { Button, Text, Wrap } from '@chakra-ui/react';
import React from 'react';
// import { useDispatch } from 'react-redux';
import { Node } from '../../types/ontologyTypes';

type ConnectionsProps = {
  connections: Array<Node>;
  titles: Array<string>;
  color: string;
  onClick: () => void;
};

const Connections: React.FC<ConnectionsProps> = ({
  connections,
  titles,
  color,
  onClick,
}: ConnectionsProps) => (
  /*
  const dispatch = useDispatch();
  const onClickConnections = (node: Node) => {
    dispatch(selectNode(node));
  };
*/
  // TODO: Define this somewhere else and use other colors. This is just a placeholder to show how correlation indices work

  <>
    <Text as="b" fontSize="xl">
      {connections.length ? titles[0] : titles[1]}
    </Text>
    <Wrap>
      {connections.map((connection) => (
        <Button colorScheme={color} style={{ margin: 5 }} key={connection.id} onClick={onClick}>
          {connection.name}
        </Button>
      ))}
    </Wrap>
  </>
);

/*
const correlationToColor = (correlation: number) => {
  switch (correlation) {
    case 2:
      return 'green';
    case 1:
      return 'yellow';
    case 0:
      return 'red';
    default:
      return 'blue';
  }
};
*/

export default Connections;
