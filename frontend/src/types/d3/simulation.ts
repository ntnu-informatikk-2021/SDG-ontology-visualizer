/* eslint-disable @typescript-eslint/indent */
import { Modify } from '../genericTypes';
import { GraphEdge, GraphNode } from '../ontologyTypes';

export type CenterForce = d3.ForceCenter<GraphNode>;

export type LinkForce = d3.ForceLink<GraphNode, GraphEdge | D3Edge>;

export type ForceSimulation = d3.Simulation<GraphNode, GraphEdge>;

export type D3Edge = Modify<
  GraphEdge,
  {
    source: GraphNode;
    target: GraphNode;
  }
>;

export type LabelTransform = {
  x: number;
  y: number;
  degree: number;
  flip: boolean;
};

export type GraphNodeFilter = (node: GraphNode) => boolean;
