import { Flex, Text } from '@chakra-ui/react';
import React, { useContext } from 'react';
import FullscreenContext from '../../context/FullscreenContext';

const GraphDescriptions: React.FC = () => {
  const { isFullscreen } = useContext(FullscreenContext);

  return (
    <Flex
      position={isFullscreen ? 'absolute' : 'static'}
      bottom={isFullscreen ? '32px' : ''}
      paddingLeft={isFullscreen ? '16px' : ''}
      paddingRight={isFullscreen ? '64px' : ''}
      height="1vw"
      width="80vw"
      justify="space-between"
    >
      <Flex>
        <svg height="40" width="40">
          <circle cx="20" cy="20" r="20" fill="#4299e1" />
        </svg>
        <Text marginTop="2" marginLeft="2">
          Standardfarge/StartNode
        </Text>
      </Flex>
      <Flex>
        <svg height="40" width="40">
          <circle cx="20" cy="20" r="20" fill="#EA5F41" />
        </svg>
        <Text marginTop="2" marginLeft="2">
          Bærekraftsmål
        </Text>
      </Flex>
      <Flex>
        <svg height="40" width="40">
          <circle cx="20" cy="20" r="20" fill="#E0E73F" />
        </svg>
        <Text marginTop="2" marginLeft="2">
          Delmål til bærekraftsmål
        </Text>
      </Flex>
      <Flex>
        <svg height="40" width="40">
          <circle cx="20" cy="20" r="20" fill="#85E664" />
        </svg>
        <Text marginTop="2" marginLeft="2">
          Trippelbunnlinje
        </Text>
      </Flex>
      <Flex>
        <svg height="40" width="40">
          <circle cx="20" cy="20" r="20" fill="#DDA93B" />
        </svg>
        <Text marginTop="2" marginLeft="2">
          Utviklingsområde
        </Text>
      </Flex>
    </Flex>
  );
};

export default GraphDescriptions;
