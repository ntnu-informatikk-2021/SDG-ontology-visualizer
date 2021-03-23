import React from 'react';
import Graph from '../atoms/Graph';
import SearchBar from '../atoms/SearchBar';
import DetailView from '../molecules/DetailView';

const OntologyPage: React.FC = () => (
  <>
    <SearchBar limit={5} margin="2em" />
    <Graph />
    <DetailView />
  </>
);
export default OntologyPage;
