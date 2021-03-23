import React from 'react';
import SearchBar from '../atoms/SearchBar';
import SustainabilityGoals from '../molecules/SustainabilityGoalsList';

const Frontpage: React.FC = () => (
  <>
    <SearchBar />
    <SustainabilityGoals />
  </>
);

export default Frontpage;
