import { Box, Container, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { getRelations } from '../api/ontologies';
import { Node, Ontology } from '../types';

const initialNode: Node = {
  prefix: {
    prefix: 'wine',
    iri: 'http://www.w3.org/TR/2003/PR-owl-guide-20031209/wine#',
  },
  name: 'FormanChardonnay',
  id: 'http://www.w3.org/TR/2003/PR-owl-guide-20031209/wine#FormanChardonnay',
};

const renderOntology = (
  selectedNode: Node,
  relatedOntology: Ontology,
  onClick: (node: Node) => void,
) => (
  <Tr>
    <Td>
      {relatedOntology.Subject ? (
        <a onClick={() => onClick(relatedOntology.Subject!)} aria-hidden="true">
          {relatedOntology.Subject.name}
        </a>
      ) : (
        <span>{selectedNode.name}</span>
      )}
    </Td>
    <Td>
      <span>{relatedOntology.Predicate.name}</span>
    </Td>
    <Td>
      {relatedOntology.Object ? (
        <a onClick={() => onClick(relatedOntology.Object!)}>{relatedOntology.Object.name}</a>
      ) : (
        <span>{selectedNode.name}</span>
      )}
    </Td>
  </Tr>
);

const OntologyTable: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState(initialNode);
  const [ontologies, setOntologies] = useState([]);

  const clickNode = async (node: Node) => {
    setSelectedNode(node);
    const newOntologies = await getRelations(node.id);
    setOntologies(newOntologies);
  };

  useEffect(() => {
    clickNode(initialNode);
  }, []);

  return (
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
        <Table variant="striped" colorScheme="linkedin" margin={1}>
          <Thead>
            <Tr>
              <Th>Subject</Th>
              <Th>Predicate</Th>
              <Th>Object</Th>
            </Tr>
          </Thead>
          <Tbody>
            {ontologies && ontologies.map((ont) => renderOntology(selectedNode, ont, clickNode))}
          </Tbody>
        </Table>
      </Box>
    </Container>
  );
};

export default OntologyTable;
