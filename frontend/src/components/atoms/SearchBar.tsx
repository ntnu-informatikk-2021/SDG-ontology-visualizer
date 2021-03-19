import { Container, Input, Menu, MenuItem } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { search } from '../../api/ontologies';
import useDebounce from '../../hooks/useDebounce';
import { selectNode } from '../../state/reducers/ontologyReducer';
import { Node } from '../../types/ontologyTypes';

const SearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 200);
  const [results, setResults] = useState<Array<Node>>();
  const dispatch = useDispatch();

  const loadResults = async (query: string) => {
    if (!query || query.length === 0) {
      setResults([]);
      return;
    }
    const newRes = await search(debouncedSearchQuery, 20);
    setResults(newRes);
  };

  const onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchQuery = ev.target.value;
    setSearchQuery(newSearchQuery);
  };

  const onClickNode = (node: Node) => {
    dispatch(selectNode(node));
  };

  useEffect(() => {
    loadResults(debouncedSearchQuery);
  }, [debouncedSearchQuery]);

  return (
    <Container centerContent w="30%" maxW="400px">
      <Input value={searchQuery} onChange={onChange} variant="flushed" placeholder="Search..." />
      <Container px="0" maxH="64" overflowY="scroll" overflowX="hidden">
        <Menu>
          {results &&
            results.map((res, index) => (
              <Link to="/ontology">
                <MenuItem
                  bgColor={index % 2 ? 'blue.100' : 'blue.200'}
                  onClick={() => onClickNode(res)}
                  key={res.id}
                >
                  {res.name}
                </MenuItem>
              </Link>
            ))}
        </Menu>
      </Container>
    </Container>
  );
};

export default SearchBar;
