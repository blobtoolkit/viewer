import React from 'react';

const PlotSquareBinSVG = ({ css, x, y, height, width, color = '#999' }) => {
  return (
    <rect className={css} fill={color} stroke={color} x={x} y={y} height={height} width={width} />
  )
};

export default PlotSquareBinSVG;
