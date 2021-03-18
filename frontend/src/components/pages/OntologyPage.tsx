import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Graph from '../atoms/Graph';
import DetailView from '../atoms/DetailView';
import { mapPrefixNameToNode } from '../../common/node';
import { selectNode } from '../../state/reducers/ontologyReducer';

interface ParamTypes {
  prefix?: string;
  name?: string;
}

const OntologyPage: React.FC = () => {
  const { prefix, name } = useParams<ParamTypes>();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!prefix || !name) return;
    const newNode = mapPrefixNameToNode(prefix, name);
    dispatch(selectNode(newNode));
  }, [prefix, name]);

  return (
    <div>
      <Graph />
      <DetailView />
    </div>
  );
};
export default OntologyPage;
