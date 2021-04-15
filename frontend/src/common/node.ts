import {
  Edge,
  GraphNode,
  GraphEdge,
  Node,
  Prefix,
  SustainabilityGoal,
} from '../types/ontologyTypes';
import { D3Edge } from '../types/d3/simulation';

export const mapPrefixNameToNode = (
  prefix: string,
  name: string,
  correlation?: number,
  type?: string,
): Node => ({
  prefix: {
    prefix,
    iri: `http://www.semanticweb.org/aga/ontologies/2017/9/${prefix}#`,
  },
  name,
  id: `http://www.semanticweb.org/aga/ontologies/2017/9/${prefix}#${name}`,
  correlation: correlation || -1,
  type: type || 'undefined',
});

export const parseNameFromClassId = (id: string): string => {
  const regex = /^[^_]*#/;
  const name = id.replace(regex, '');
  if (!name || name === id) return '';
  return name;
};

export const parsePrefixFromClassId = (id: string): Prefix | null => {
  const prefixRegex = /(?<=\/)([^/]*)(?=#)/;
  const prefixMatches = id.match(prefixRegex);
  if (!prefixMatches || !prefixMatches[0]) return null;

  const iriRegex = /^[^_]*#/;
  const iriMatches = id.match(iriRegex);
  if (!iriMatches || !iriMatches[0]) return null;

  return {
    prefix: prefixMatches[0],
    iri: iriMatches[0],
  };
};

export const mapIdToNode = (id: string, correlation?: number, type?: string): Node | null => {
  const prefix = parsePrefixFromClassId(id);
  const name = parseNameFromClassId(id);
  if (!prefix || !name) return null;
  return {
    prefix,
    name,
    id,
    correlation: correlation || -1,
    type: type || 'undefined',
  };
};

export const mapSustainabilityGoalToNode = (sdg: SustainabilityGoal): Node | null => {
  const node = mapIdToNode(sdg.instancesOf);
  if (!node) return null;
  node.name = sdg.label;
  return node;
};

export const mapIdToEdge = (id: string, correlation: number): Edge | null => {
  const prefix = parsePrefixFromClassId(id);
  const name = parseNameFromClassId(id);
  if (!prefix || !name) return null;
  return {
    prefix,
    name,
    id,
    correlation,
  };
};

export const mapCorrelationToName = (correlation: number) => {
  switch (correlation) {
    case 3:
      return 'høy';
    case 2:
      return 'medium';
    case 1:
      return 'lav';
    default:
      return '';
  }
};

export const mapCorrelationToColor = (correlation: number) => {
  switch (correlation) {
    case 3:
      return '.600';
    case 2:
      return '.500';
    case 1:
      return '.400';
    default:
      return '.300';
  }
};
const isPosetiveConnection = (edge: D3Edge | GraphEdge, value: number): boolean => {
  if (value === 2 && edge.correlation === 1) {
    return true;
  }
  if (value === 1 && (edge.correlation === 1 || edge.correlation === 2)) {
    return true;
  }
  if (value === 0 && (edge.correlation === 1 || edge.correlation === 2 || edge.correlation === 3)) {
    return true;
  }
  return false;
};
const isNegativeConnection = (edge: D3Edge | GraphEdge, value: number): boolean => {
  if (value === 2 && edge.correlation === -1) {
    return true;
  }
  if (value === 1 && (edge.correlation === -1 || edge.correlation === -2)) {
    return true;
  }
  if (
    value === 0 &&
    (edge.correlation === -1 || edge.correlation === -2 || edge.correlation === -3)
  ) {
    return true;
  }
  return false;
};

export const isSubgoal = (node: GraphNode): boolean => node.type === 'Delmål';
export const isConnection = (edge: D3Edge | GraphEdge, Pvalue: number, Nvalue: number): boolean => {
  if (isPosetiveConnection(edge, Pvalue)) return true;
  if (isNegativeConnection(edge, Nvalue)) return true;
  return false;
};
