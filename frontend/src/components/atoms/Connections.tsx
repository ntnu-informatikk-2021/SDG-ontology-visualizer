import { Button, Text, Wrap } from '@chakra-ui/react';
import React from 'react';
import { useDispatch } from 'react-redux';
import { selectNode } from '../../state/reducers/ontologyReducer';
import { Node } from '../../types/ontologyTypes';

type ConnectionsProps = {
  connections: Array<Node>;
  titles: Array<string>;
  color: string;
};

const Connections: React.FC<ConnectionsProps> = ({
  connections,
  titles,
  color,
}: ConnectionsProps) => {
  const dispatch = useDispatch();

  const onClickConnections = (node: Node) => {
    dispatch(selectNode(node));
  };

  return (
    <>
      <Text>{connections.length ? titles[0] : titles[1]}</Text>
      <Wrap>
        {connections.map((connection) => (
          <Button
            onClick={() => onClickConnections(connection)}
            colorScheme={color}
            style={{ margin: 5 }}
            key={connection.id}
          >
            {connection.name}
          </Button>
        ))}
      </Wrap>
    </>
  );
};

export default Connections;
