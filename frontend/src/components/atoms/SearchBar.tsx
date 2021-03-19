import { Container, Input, Menu, MenuItem } from '@chakra-ui/react';
import React, { useState } from 'react';
import { search } from '../../api/ontologies';
import { Node } from '../../types/ontologyTypes';

const SearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Array<Node>>();

  const loadResults = async (query: string) => {
    if (!query || query.length === 0) {
      setResults([]);
      return;
    }
    const newRes = await search(query, 20);
    setResults(newRes);
  };

  const onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchQuery = ev.target.value;
    setSearchQuery(newSearchQuery);
    loadResults(newSearchQuery);
  };

  return (
    <Container centerContent w="30%" maxW="400px">
      <Input value={searchQuery} onChange={onChange} variant="flushed" placeholder="Basic usage" />
      <Container px="0" maxH="64" overflowY="scroll" overflowX="hidden">
        <Menu>
          {results &&
            results.map((res, index) => (
              <MenuItem
                bgColor={index % 2 ? 'blue.100' : 'blue.200'}
                onClick={() => console.log(res.name)}
                key={res.id}
              >
                {res.name}
              </MenuItem>
            ))}
        </Menu>
      </Container>
    </Container>
  );
};

export default SearchBar;
