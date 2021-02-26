import React, { useRef, useEffect } from 'react';
import { select } from 'd3';

const Graph: React.FC = () => {
  const svgref = useRef(null);
  const data = [{ x: 100, y: 100 }];

  useEffect(() => {
    const svg = select(svgref.current);
    svg
      .selectAll('.node')
      .data(data)
      .join('circle')
      .attr('class', 'node')
      .attr('r', 10)
      .attr('fill', 'blue')
      .attr('cx', (node) => node.x)
      .attr('cy', (node) => node.y);
  }, []);
  return <svg ref={svgref} />;
};

export default Graph;
