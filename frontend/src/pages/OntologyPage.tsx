import React from 'react';
import Graph from '../components/Graph';
import { Node } from '../types/ontologyTypes';
import DetailView from '../components/DetailView';

const initialNode: Node = {
  prefix: {
    prefix: 'SDG',
    iri: 'http://www.semanticweb.org/aga/ontologies/2017/9/SDG#',
  },
  name: 'B4',
  id: 'http://www.semanticweb.org/aga/ontologies/2017/9/SDG#B4',
};
function OntologyPage() {
  return (
    <div>
      <Graph />
      <DetailView node={initialNode} />
    </div>
  );
}

export default OntologyPage;
