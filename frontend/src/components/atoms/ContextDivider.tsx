import { Center, Divider } from '@chakra-ui/react';
import React from 'react';

type ContextDividerProps = {
  visible: boolean;
};

const ContextDivider: React.FC<ContextDividerProps> = ({ visible }: ContextDividerProps) => {
  if (!visible) return <></>;
  return (
    <Center mx={[10, null, null, 20]}>
      <Divider orientation="vertical" />
    </Center>
  );
};

export default ContextDivider;
