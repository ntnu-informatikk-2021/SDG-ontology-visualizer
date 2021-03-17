import React, { useState, useEffect } from 'react';
import { Box, Container } from '@chakra-ui/react';
import { getSustainabilityGoals } from '../api/ontologies';
import {  Node, SustainabilityGoal } from '../types/ontologyTypes';

// type IconContainerProps = {
//   sustainabilityNode: Node;
// };

const IconContainer = () => {
    const [sustainabilityGoals, setSustainabilityGoals] = useState<SustainabilityGoal>({
        instancesOf: '',
        label: '',
        icon: '',
      });
    
      const loadSustainabilityGoals = async () => {
        const data = await getSustainabilityGoals(node.id);
        setSustainabilityGoals(data);
      };
    
      useEffect(() => {
        loadSustainabilityGoals();
      }, []);

       const [sustainabilityGoals, setSustainabilityGoals] = useState<SustainabilityGoal>({
        instancesOf: '',
        label: '',
        icon: '',
      });
    
      const loadSustainabilityGoals = async () => {
        const data = await getSustainabilityGoals(imageid.id);
        setSustainabilityGoals(data);
      };
    
      useEffect(() => {
        loadSustainabilityGoals();
      }, []);
  
      return(
  <Container paddingTop={20} centerContent>
    <Box
      borderWidth="1g"
      borderRadius={5}
      p={0}
      w="150%"
      overflow="hidden"
      border="2px"
      borderColor="linkedin.400"
    >
      <p>{sustainabilityGoals.label}</p>
      <img src={sustainabilityGoals{imageid}.icon} alt="fn.no" />
    </Box>
  </Container>
      )};

      export default IconContainer;