import React from 'react';
import PlotBubbleSVG from './PlotBubbleSVG'

const PlotBubblesSVG = ({ bubbles, color, bubblecss }) => (
    <g color={color}>
      {bubbles.map(bubble =>
        <PlotBubbleSVG key={bubble.id} {...bubble} css={bubblecss} />
      )}
    </g>
);

export default PlotBubblesSVG;
