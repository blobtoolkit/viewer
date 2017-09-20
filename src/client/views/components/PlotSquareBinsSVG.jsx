import React from 'react';
import PlotSquareBinSVG from './PlotSquareBinSVG'
import PlotHexBinSVG from './PlotHexBinSVG'

const PlotSquareBinsSVG = ({ data, color, css }) => (
    <g color={color}>
      {data.map(square =>
        <PlotSquareBinSVG key={square.id} {...square} css={css} />
      )}
    
      {data.map(square =>
        <PlotHexBinSVG key={square.id+'_hex'} {...square} css={css} />
      )}
    </g>
);

export default PlotSquareBinsSVG;
