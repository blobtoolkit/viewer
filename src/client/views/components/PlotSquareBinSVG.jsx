import React from 'react';

const PlotSquareBinSVG = ({ x, y, zs, side = 50 }) => {
  //let width = Math.sqrt(zs.reduce((a,b)=>Math.max(a,b)))*2
  let width = Math.log(zs.reduce((a,b)=>(a+b))+1)*4
  let offset = (side - width) / 2
  return (
    <rect x={offset + x*side} y={offset + y*side} width={width} height={width}/>
  )
};

export default PlotSquareBinSVG;
