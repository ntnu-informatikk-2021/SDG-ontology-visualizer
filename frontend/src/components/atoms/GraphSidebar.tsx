import { Checkbox, Heading, Stack } from '@chakra-ui/react';
import React, { useContext } from 'react';
import FullscreenContext from '../../context/FullscreenContext';

type GraphSidebarProps = {
  onSubgoalFilter: () => void;
};

const GraphSidebar: React.FC<GraphSidebarProps> = ({ onSubgoalFilter }: GraphSidebarProps) => {
  const { isFullscreen } = useContext(FullscreenContext);

  return (
    <Stack
      bg="white"
      borderRadius="lg"
      p="5"
      w="12vw"
      h="100%"
      position={isFullscreen ? 'absolute' : 'sticky'}
      right="0"
      bgColor={isFullscreen ? 'gray.400' : 'white'}
    >
      <Heading as="h3">Filter</Heading>
      <Checkbox defaultIsChecked={false} onChange={onSubgoalFilter}>
        Vis delmål
      </Checkbox>
    </Stack>
  );
};

export default GraphSidebar;
