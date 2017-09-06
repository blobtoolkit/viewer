import React from 'react';
import PreviewBar from './PreviewBar'

const PreviewBars = ({ bars, barcss }) => (
    <g>
      {bars.map(bar =>
        <PreviewBar key={bar.id} {...bar} css={barcss} />
      )}
    </g>
);

export default PreviewBars;
