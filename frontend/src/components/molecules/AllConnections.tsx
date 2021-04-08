import { Stack } from '@chakra-ui/react';
import React from 'react';
import Connections from '../atoms/Connections';
import { Node } from '../../types/ontologyTypes';

type AllConnectionsProps = {
  contributions: Array<Node>;
  tradeOffs: Array<Node>;
  developmentAreas: Array<Node>;
  onClick: (connection: Node) => void;
};

const AllConnections: React.FC<AllConnectionsProps> = ({
  contributions,
  tradeOffs,
  developmentAreas,
  onClick,
}: AllConnectionsProps) => (
  <Stack spacing={5} minW="40%">
    <Connections
      connections={contributions}
      titles={['Har positiv virkning til:', 'Har ingen etablerte positive påvirkninger enda']}
      color="green"
      handleOnClick={onClick}
    />
    <Connections
      connections={tradeOffs}
      titles={['Har negativ virkning til:', 'Har ingen etablerte negative påvirkninger enda']}
      color="red"
      handleOnClick={onClick}
    />
    <Connections
      connections={developmentAreas}
      titles={['Har utviklingsområde til:', 'Har ingen utviklingsområder']}
      color="blue"
      handleOnClick={onClick}
    />
  </Stack>
);

export default AllConnections;
