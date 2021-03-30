import { Edge, GraphEdge, GraphNode } from '../ontologyTypes';

export type CenterForce = d3.ForceCenter<GraphNode>;

export type LinkForce = d3.ForceLink<GraphNode, GraphEdge | D3Edge>;

export type ForceSimulation = d3.Simulation<GraphNode, GraphEdge>;

export interface D3Edge extends Edge {
  source: GraphNode;
  target: GraphNode;
}
