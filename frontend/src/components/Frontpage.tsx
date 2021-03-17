import React from 'react';
import { IconContainer } from './IconContainer';
import { Node } from '../types/ontologyTypes';

// Initial node displayed on the frontpage
const sustainabilityNode: Node = {
  prefix: {
    prefix: 'SDG',
    iri: 'http://www.semanticweb.org/aga/ontologies/2017/9/SDG#',
  },
  name: 'SDG',
  id: 'http://www.semanticweb.org/aga/ontologies/2017/9/SDG#SDG',
};

const Frontpage = () => <IconContainer node={sustainabilityNode} />;
export default Frontpage;
