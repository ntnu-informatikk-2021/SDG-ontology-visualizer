import { SearchIcon } from '@chakra-ui/icons';
import {
  Input,
  InputGroup,
  InputLeftAddon,
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
    <Popover isOpen={searchQuery !== '' && results?.length !== 0} autoFocus={false}>
      <PopoverTrigger>
        <InputGroup size="sm" maxW="sm">
          <InputLeftAddon pointerEvents="none" bg="white">
            <SearchIcon color="gray.400" />
          </InputLeftAddon>
          <Input
            aria-label="Søk i bærekraftsontologien"
            value={searchQuery}
            onChange={onChange}
            variant="outline"
            bg="white"
            placeholder="Søk..."
          />
        </InputGroup>
      </PopoverTrigger>
      <PopoverContent border="none" boxShadow="xl" borderBottomRadius="lg" matchWidth>
        <Stack w="100%">
          {results &&
            results.map((res) => (
              <Link
                color="gray.800"
                p={2}
                fontSize="sm"
                _hover={{
                  backgroundColor: 'cyan.600',
                  color: 'white',
                }}
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
  );
};

SearchBar.defaultProps = {
  limit: undefined,
};

export default SearchBar;
