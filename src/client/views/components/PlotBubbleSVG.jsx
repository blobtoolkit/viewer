import React from 'react';
import { plotShapes } from './PlotStyles'

const PlotBubbleSVG = ({ x, y, r }) => (
  <circle cx={x} cy={y} r={r} style={plotShapes.circle}/>
);

export default PlotBubbleSVG;
