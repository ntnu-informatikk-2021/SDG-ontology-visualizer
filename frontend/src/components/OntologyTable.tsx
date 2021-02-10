import React, { useState, useEffect } from 'react';
import { getRelations } from '../api/ontologies';
import { Node, Ontology } from '../types';

const initialNode: Node = {
  name: 'FormanChardonnay',
  id: 'http://www.w3.org/TR/2003/PR-owl-guide-20031209/wine#FormanChardonnay',
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
    const newOntologies = await getRelations(node.name);
    setOntologies(newOntologies);
  };

  useEffect(() => {
    clickNode(initialNode);
  }, []);

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
