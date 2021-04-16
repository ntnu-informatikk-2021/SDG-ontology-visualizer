import { Button, Checkbox, HStack } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import SearchBar from './SearchBar';

type GraphToolBarProps = {
  onSubgoalFilter: () => void;
  onUnlockNodes: React.Dispatch<React.SetStateAction<boolean>>;
  onEdgeLabelsVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const GraphToolBar: React.FC<GraphToolBarProps> = ({
  onSubgoalFilter,
  onUnlockNodes,
  onEdgeLabelsVisible,
}: GraphToolBarProps) => {
  const { isFullscreen } = useSelector((state: RootState) => state.fullscreenStatus);
  return (
    <HStack bg="cyan.500" borderRadius={isFullscreen ? 'none' : 'lg'} p="2" spacing="5">
      <SearchBar limit={5} />
      <Checkbox color="white" size="lg" onChange={onSubgoalFilter}>
        Vis delmål
      </Checkbox>
      <Checkbox
        defaultIsChecked
        color="white"
        size="lg"
        onChange={() => onEdgeLabelsVisible((current) => !current)}
      >
        Vis kanttext
      </Checkbox>
      <Button onClick={() => onUnlockNodes((current) => !current)}>Lås opp alle noder</Button>
    </HStack>
  );
};

export default GraphToolBar;
