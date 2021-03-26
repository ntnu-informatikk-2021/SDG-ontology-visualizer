import { Box } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import React from 'react';
import { MotionBox } from '../../types/react/componentTypes';

interface SlideInDrawerProps {
  expanded: Boolean;
  width: string;
  children: JSX.Element;
}

const SlideInDrawer = ({ expanded, width, children }: SlideInDrawerProps) => (
  <AnimatePresence initial={false}>
    {expanded && (
      <MotionBox
        key="content"
        initial="collapsed"
        animate="open"
        exit="collapsed"
        variants={{
          open: { width: 'auto' },
          collapsed: { width: 0 },
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <Box overflow="hidden">
          <Box w={width}>{children}</Box>
        </Box>
      </MotionBox>
    )}
  </AnimatePresence>
);

export default SlideInDrawer;
