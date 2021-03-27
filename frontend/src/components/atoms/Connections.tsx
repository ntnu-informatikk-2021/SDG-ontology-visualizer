import { Button, Text, Wrap } from '@chakra-ui/react';
import React from 'react';
import { correlationToColor } from '../../common/node';
// import { useDispatch } from 'react-redux';
import { Node } from '../../types/ontologyTypes';

type ConnectionsProps = {
  connections: Array<Node>;
  titles: Array<string>;
  color: string;
  onClick: (selectedConnection: Node) => void;
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
      {connections
        .sort((a, b) => b.correlation - a.correlation)
        .map((connection) => {
          return (
            <Button
              colorScheme="whiteAlpha"
              bg={color + correlationToColor(connection.correlation)}
              style={{ margin: 5 }}
              key={connection.id}
              onClick={() => onClick(connection)}
            >
              {connection.name}
            </Button>
          );
        })}
    </Wrap>
  </>
);

export default Connections;
