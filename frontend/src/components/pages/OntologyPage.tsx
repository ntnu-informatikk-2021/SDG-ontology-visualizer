import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Graph from '../atoms/Graph';
import { Node } from '../../types/ontologyTypes';
import DetailView from '../atoms/DetailView';
import { mapPrefixNameToNode } from '../../common/node';

interface ParamTypes {
  prefix?: string;
  name?: string;
}

function OntologyPage() {
  const { prefix, name } = useParams<ParamTypes>();
  const [currentNode, setcurrentNode] = useState<Node>();
  useEffect(() => {
    if (!prefix || !name) return;
    const newNode = mapPrefixNameToNode(prefix, name);
    setcurrentNode(newNode);
  }, [prefix, name]);

  return (
    <div>
      <Graph initialNode={currentNode} />
      <DetailView node={currentNode} />
    </div>
  );
}
export default OntologyPage;
