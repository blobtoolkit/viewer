import React from 'react';

const PlotBubbleSVG = ({ css, cx, cy, r }) => (
  <circle cx={cx} cy={cy} r={r} className={css}/>
);

export default PlotBubbleSVG;
