import React, { useState, useEffect } from 'react';
import { Node, Ontology } from './types';

const initialNode = {
  name: 'FormanChardonnay',
  id: 'http://www.w3.org/TR/2003/PR-owl-guide-20031209/wine#FormanChardonnay',
};

const getData = async (className: string) => {
  const url = `http://localhost:3001/class/%3A${className}`;
  const bar = await fetch(url).then((foo) => foo.json());
  return bar;
};

const renderOntology = (
  selectedNode: Node,
  relatedOntology: Ontology,
  onClick: (node: Node) => void,
) => (
  <tr>
    <td>
      {relatedOntology.Subject ? (
        <a onClick={() => onClick(relatedOntology.Subject!)} aria-hidden="true">
          {relatedOntology.Subject.name}
        </a>
      ) : (
        <span>{selectedNode.name}</span>
      )}
    </td>
    <td>
      <span>{relatedOntology.Predicate.name}</span>
    </td>
    <td>
      {relatedOntology.Object ? (
        <a onClick={() => onClick(relatedOntology.Object!)}>{relatedOntology.Object.name}</a>
      ) : (
        <span>{selectedNode.name}</span>
      )}
    </td>
  </tr>
);

const OntologyTable: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState(initialNode);
  const [ontologies, setOntologies] = useState([]);

  const clickNode = async (node: Node) => {
    setSelectedNode(node);
    const newOntologies = await getData(node.name);
    console.log('new ontologies:');
    console.log(newOntologies);
    setOntologies(newOntologies);
  };

  useEffect(() => {
    clickNode(initialNode);
  }, []);

  if (ontologies && ontologies.length > 0) {
    console.log(renderOntology(selectedNode, ontologies[0], clickNode));
  }
  return (
    <table>
      <thead>
        <tr>
          <th>Subject</th>
          <th>Predicate</th>
          <th>Object</th>
        </tr>
      </thead>
      {ontologies && ontologies.map((ont) => renderOntology(selectedNode, ont, clickNode))}
    </table>
  );
};

export default OntologyTable;
