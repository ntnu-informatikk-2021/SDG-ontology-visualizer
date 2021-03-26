import { SearchIcon } from '@chakra-ui/icons';
import {
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Stack,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { search } from '../../api/ontologies';
import useDebounce from '../../hooks/useDebounce';
import { selectNode } from '../../state/reducers/ontologyReducer';
import { Node } from '../../types/ontologyTypes';

interface SearchBarProps {
  limit?: number;
  margin?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ limit, margin }: SearchBarProps) => {
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
    <Flex justify="center" align="center" maxW="400px" marginLeft={margin}>
      <Popover isOpen={searchQuery !== '' && results?.length !== 0} autoFocus={false}>
        <PopoverTrigger>
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
        </PopoverTrigger>
        <PopoverContent border="none">
          <Stack w="100%">
            {results &&
              results.map((res) => (
                <Link
                  padding={2}
                  _hover={{ backgroundColor: 'purple.800', color: 'white' }}
                  key={res.id}
                  onClick={() => {
                    onClickNode(res);
                    history.push('/ontology');
                  }}
                >
                  {res.name}
                </Link>
              ))}
          </Stack>
        </PopoverContent>
      </Popover>
    </Flex>
  );
};

SearchBar.defaultProps = {
  limit: undefined,
  margin: '',
};

export default SearchBar;
