import React from 'react'
import { plotText } from './PlotStyles'

const SnailPlotLegend = ({title,list=[]}) => {
  let items = []
  let offset = 20
  let w = 25
  let h = 25
  let gap = 10
  let ds = (
    <g transform={'translate('+0+','+0+')'}>
      <text style={plotText.snailLegendTitle}>{title}</text>
    </g>
  )
  list.forEach((l,i)=>{
    let text = l.label
    if (l.value) text += ' (' + l.value + ')'
    if (!l.color){
      offset -= gap
    }
    items.push(
      <g key={i} transform={'translate(0,'+offset+')'}>
        {l.color && <rect x={0} y={-gap/2} width={w} height={h} style={{fill:l.color,stroke:'black'}} />}
        <text style={plotText.snailLegend} transform={'translate('+(l.color ? (w+gap) : 0)+','+(h-gap)+')'}>{text}</text>
      </g>
    )
    offset += h+gap
  })
  return (
    <g>
      {ds}
      {items}
    </g>
  )
}

export default SnailPlotLegend
