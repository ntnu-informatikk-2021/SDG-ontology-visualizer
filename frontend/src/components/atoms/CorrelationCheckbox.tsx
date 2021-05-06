import React from 'react';
import { MenuItem, Checkbox } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { setCorrelationFilter } from '../../state/reducers/ontologyReducer';
import { RootState } from '../../state/store';
import { CorrelationFilter } from '../../types/ontologyTypes';

interface CheckboxProps {
  text: string;
  isPositive: boolean;
  index: number;
}
const CorrelationCheckbox: React.FC<CheckboxProps> = ({
  text,
  isPositive,
  index,
}: CheckboxProps) => {
  const dispatch = useDispatch();
  const { correlationFilter } = useSelector((state: RootState) => state.ontology);

  const getCorrectFilterValue = (filter: CorrelationFilter): boolean => {
    if (isPositive && index === 0) return filter.pLow;
    if (isPositive && index === 1) return filter.pMedium;
    if (isPositive && index === 2) return filter.pHigh;
    if (!isPositive && index === 0) return filter.nLow;
    if (!isPositive && index === 1) return filter.nMedium;
    return filter.nHigh;
  };

  const isChecked = getCorrectFilterValue(correlationFilter);

  return (
    <MenuItem
      _hover={{
        bg: 'cyan.500',
      }}
    >
      <Checkbox
        width="100%"
        height="100%"
        type="checkbox"
        isChecked={isChecked}
        colorScheme="cyan"
        color="white"
        size="md"
        onChange={() => dispatch(setCorrelationFilter(isPositive, index))}
      >
        {text}
      </Checkbox>
    </MenuItem>
  );
};

export default CorrelationCheckbox;
