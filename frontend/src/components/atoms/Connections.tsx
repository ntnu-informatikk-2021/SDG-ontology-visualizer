import { Button, Text } from '@chakra-ui/react';
import React from 'react';
import { useDispatch } from 'react-redux';
import { selectNode } from '../../state/reducers/ontologyReducer';
import { Node } from '../../types/ontologyTypes';

type ConnectionsProps = {
  connections: Array<Node>;
  titles: Array<string>;
};

const Connections: React.FC<ConnectionsProps> = ({ connections, titles }: ConnectionsProps) => {
  const dispatch = useDispatch();

  const onClickConnections = (node: Node) => {
    dispatch(selectNode(node));
  };

  // TODO: Define this somewhere else and use other colors. This is just a placeholder to show how correlation indices work
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

  return (
    <>
      <Text>{connections.length ? titles[0] : titles[1]}</Text>
      {connections
        .sort((a, b) => b.correlation - a.correlation)
        .map((connection) => (
          <Button
            onClick={() => onClickConnections(connection)}
            colorScheme={correlationToColor(connection.correlation)}
            style={{ margin: 5 }}
            key={connection.id}
          >
            {connection.name}
          </Button>
        ))}
    </>
  );
};

export default Connections;
