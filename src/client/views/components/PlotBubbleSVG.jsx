import React from 'react';

const PlotBubbleSVG = ({ css, x, y, r }) => (
  <circle cx={x} cy={y} r={r} className={css}/>
);

export default PlotBubbleSVG;
