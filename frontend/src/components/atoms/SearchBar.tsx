import { SearchIcon } from '@chakra-ui/icons';
import { Input, Menu, MenuItem, Box, InputGroup, InputLeftElement } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { search } from '../../api/ontologies';
import useDebounce from '../../hooks/useDebounce';
import { selectNode } from '../../state/reducers/ontologyReducer';
import { Node } from '../../types/ontologyTypes';

interface SearchBarProps {
  limit?: number;
}

const SearchBar: React.FC<SearchBarProps> = ({ limit }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 200);
  const [results, setResults] = useState<Array<Node>>();
  const dispatch = useDispatch();
  const history = useHistory();

  const loadResults = async (query: string) => {
    if (!query || query.length === 0) {
      setResults([]);
      return;
    }
    const newRes = await search(debouncedSearchQuery, limit);
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
    <Box>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.400" />
        </InputLeftElement>
        <Input
          value={searchQuery}
          onChange={onChange}
          variant="outline"
          bg="white"
          placeholder="Søk..."
        />
      </InputGroup>
      <Menu>
        {results &&
          results.map((res, index) => (
            <MenuItem
              key={res.id}
              bgColor={index % 2 ? 'blue.100' : 'blue.200'}
              onClick={() => {
                onClickNode(res);
                history.push('/ontology');
              }}
            >
              {res.name}
            </MenuItem>
          ))}
      </Menu>
    </Box>
  );
};

SearchBar.defaultProps = {
  limit: undefined,
};

export default SearchBar;
