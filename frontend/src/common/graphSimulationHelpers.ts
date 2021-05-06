import { NodeMenuTransform } from '../types/d3/svg';
import { normalizeScale } from './other';

export const getEdgeLabelOpacity = (scale: number): number => {
  if (scale >= 1) return 1;
  if (scale > 0.9) return normalizeScale(scale, 0.9, 1);
  return 0;
};

/*
  Simple functions to select specific elements in the DOM. For example, a node contains a circle, label and lock icon.
  Because these are just selected from the DOM, they must be selected based on their sibling index in the DOM. To
  avoid having to remember all the indices, these functions were made.
*/
export const selectNodeOrEdge = (_: any, index: number) => index === 0;
export const selectEdgeLabel1 = (_: any, index: number) => index === 1;
export const selectEdgeLabel2 = (_: any, index: number) => index === 2;
export const selectNodeLockIcon = (_: any, index: number) => index === 1;
export const selectNodeLabel = (_: any, index: number) => index === 2;

/*
  Determines whether edge labels should be rendered. As edge labels are by far the most demanding part of the render
  cycle, the labels skip frames if the user's FPS is low.
*/
export const shouldRenderEdgeLabel = (fps: number, frameIndex: number): boolean => {
  let frameSkips = 1;
  if (fps < 15) frameSkips = 10;
  else if (fps < 20) frameSkips = 6;
  else if (fps < 30) frameSkips = 4;
  else if (fps < 40) frameSkips = 2;
  if (frameIndex < frameSkips) return false;
  return true;
};

export const getEdgeLabelFontSize = (fontSize: number, maxFontSize: number, scale: number) =>
  Math.min(fontSize / scale, maxFontSize);

export const getNodeLabelFontSize = (scale: number, fontSize: number) =>
  scale <= 0.6 ? fontSize / 0.6 : fontSize / scale;

export const getNodeMenuPosition = (
  nodeRadius: number,
  highlightMultiplier: number,
  scale: number,
): NodeMenuTransform => {
  const yPos = -nodeRadius * highlightMultiplier - 15 / scale;
  return { x: 0, y: yPos, scale: 1 / scale };
};
