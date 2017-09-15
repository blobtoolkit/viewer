import React from 'react';
import PlotSquareBinSVG from './PlotSquareBinSVG'

const PlotSquareBinsSVG = ({ data, color, css }) => (
    <g color={color}>
      {data.map(square =>
        <PlotSquareBinSVG key={square.id} {...square} css={css} />
      )}
    </g>
);

export default PlotSquareBinsSVG;
