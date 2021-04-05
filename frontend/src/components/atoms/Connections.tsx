import { Button, Text, Wrap } from '@chakra-ui/react';
import React from 'react';
import { mapCorrelationToColor } from '../../common/node';
import { Node } from '../../types/ontologyTypes';

type ConnectionsProps = {
  connections: Array<Node>;
  titles: Array<string>;
  color: string;
  handleOnClick: (selectedConnection: Node) => void;
};

const Connections: React.FC<ConnectionsProps> = ({
  connections,
  titles,
  color,
  handleOnClick,
}: ConnectionsProps) => (
  <>
    <Text as="b" fontSize="xl">
      {connections.length ? titles[0] : titles[1]}
    </Text>
    <Wrap>
      {connections
        .sort((a, b) => b.correlation - a.correlation)
        .map((connection) => (
          <Button
            colorScheme="whiteAlpha"
            bg={color + mapCorrelationToColor(connection.correlation)}
            style={{ margin: 5 }}
            key={connection.id}
            onClick={() => handleOnClick(connection)}
          >
            {connection.name}
          </Button>
        ))}
    </Wrap>
  </>
);

export default Connections;
