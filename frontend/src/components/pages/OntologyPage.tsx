import React from 'react';
import SearchBar from '../atoms/SearchBar';
import DetailView from '../molecules/DetailView';
import GraphContainer from '../molecules/GraphContainer';
import SubGoalsGrid from '../molecules/SubGoalsGrid';

const OntologyPage: React.FC = () => (
  <>
    <SearchBar limit={5} margin="2em" />
    <GraphContainer />
    <DetailView />
    <SubGoalsGrid />
  </>
);
export default OntologyPage;
