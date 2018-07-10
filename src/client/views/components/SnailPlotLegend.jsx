import React from 'react';
import styles from './Plot.scss'

const SnailPlotLegend = ({title,list}) => {
  let items = []
  let offset = 20
  let w = 25
  let h = 25
  let gap = 10
  let ds = (
    <g transform={'translate('+0+','+0+')'}>
      <text className={styles.snail_legend_title}>{title}</text>
    </g>
  )
  list.forEach((l,i)=>{
    let text = l.label
    if (l.value) text += ' (' + l.value + ')'
    items.push(
      <g key={i} transform={'translate(0,'+offset+')'}>
        <rect x={0} y={-gap/2} width={w} height={h} style={{fill:l.color,stroke:'black'}} />
        <text className={styles.snail_legend} transform={'translate('+(w+gap)+','+(h-gap)+')'}>{text}</text>
      </g>
    )
    offset += h + gap
  })
  // let headers = ['count']
  // if (reducer != 'count'){
  //   headers.push(reducer+' '+zAxis)
  // }
  // if (zAxis == 'length'){
  //   headers.push('n50')
  // }
  // legendKey = (
  //   <g transform={'translate('+(w+gap)+','+(offset-gap)+')'}>
  //     <text className={styles.legend} transform={'translate(260)'} style={{textAnchor:'end',fontWeight:'normal'}}>[{headers.join(', ')}]</text>
  //   </g>
  // )
  // let title = 'total'
  // let color = '#999'
  // let numbers = []
  // let count = values.counts.all > 0
  // numbers.push(values.counts.all)
  // if (reducer != 'count'){
  //   numbers.push(format(values.reduced.all))
  // }
  // if (zAxis == 'length'){
  //   numbers.push(format(values.n50.all))
  // }
  // if (count){
  //   items.push(
  //     <g key='all' transform={'translate(0,'+offset+')'}>
  //       <rect x={0} y={0} width={w} height={h} style={{fill:color,stroke:'black'}} />
  //       <text className={styles.legend} transform={'translate('+(w+gap)+','+(h-gap)+')'}>{title}</text>
  //       <text className={styles.legend} transform={'translate('+(w+gap+260)+','+(h-gap)+')'} style={{textAnchor:'end'}}>[{numbers.join(', ')}]</text>
  //     </g>
  //   )
  //   offset += h + gap
  // }
  // bins.forEach((bin,i) => {
  //   let title = bin.id
  //   let color = palette.colors[i]
  //   let numbers = []
  //   let count = values.counts.binned[i] > 0
  //   numbers.push(values.counts.binned[i])
  //   if (reducer != 'count'){
  //     numbers.push(format(values.reduced.binned[i]))
  //   }
  //   if (zAxis == 'length'){
  //     numbers.push(format(values.n50.binned[i]))
  //   }
  //   if (count){
  //     items.push(
  //       <g key={i} transform={'translate(0,'+offset+')'}>
  //         <rect x={0} y={0} width={w} height={h} style={{fill:color,stroke:'black'}} />
  //         <text className={styles.legend} transform={'translate('+(w+gap)+','+(h-gap)+')'}>{title}</text>
  //         <text className={styles.legend} transform={'translate('+(w+gap+260)+','+(h-gap)+')'} style={{textAnchor:'end'}}>[{numbers.join(', ')}]</text>
  //       </g>
  //     )
  //     offset += h + gap
  //   }
  // })
  return (
    <g>
      {ds}
      {items}
    </g>
  )
}

export default SnailPlotLegend
