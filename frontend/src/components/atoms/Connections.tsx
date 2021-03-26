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

export default Connections;
