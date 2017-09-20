import React from 'react';
import styles from './Plot.scss'

const PlotSquareGridSVG = ({ side = 50, size = 1000 }) => {
  let lines = []
  for (let i = side; i < size; i += side){
    lines.push(<line key={'x'+i} x1={0} y1={i} x2={size} y2={i} />)
    lines.push(<line key={'y'+i} x1={i} y1={0} x2={i} y2={size} />)
  }
  return (
    <g className={styles.grid}>
    {lines}
    </g>
  )
};

export default PlotSquareGridSVG;
