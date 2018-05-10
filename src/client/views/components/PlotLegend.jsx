import React from 'react';
import { connect } from 'react-redux'
import { getSummary }  from '../reducers/summary'
import styles from './Plot.scss'
import { format as d3format} from 'd3-format'

export default class PlotLegend extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = () => {
      return (state, props) => (
        getSummary(state)
      )
    }
  }

  render(){
    const ConnectedLegend = connect(
      this.mapStateToProps
    )(Legend)
    return (
      <ConnectedLegend />
    )
  }
}

const Legend = ({values,zAxis,bins,palette,other}) => {
  let items = []
  let legendKey
  let format = d3format(".2s")
  if (bins){
    let offset = 0
    let w = 20
    let h = 20
    let gap = 5
    legendKey = (
      <g transform={'translate('+(w+gap)+','+(-gap)+')'}>
        <text transform={'translate(260)'} style={{textAnchor:'end',fontWeight:'normal'}}>[count, sum length, n50]</text>
      </g>
    )
    bins.forEach((bin,i) => {
      let title = bin.id
      let color = palette.colors[i]
      let count = values.counts.binned[i]
      let reduced = values.reduced.binned[i]
      let n50 = values.n50.binned[i]
      if (count){
        items.push(
          <g key={i} transform={'translate(0,'+offset+')'}>
            <rect x={0} y={0} width={w} height={h} style={{fill:color}} />
            <text transform={'translate('+(w+gap)+','+(h-gap)+')'}>{title}</text>
            <text transform={'translate('+(w+gap+260)+','+(h-gap)+')'} style={{textAnchor:'end'}}>[{format(count)}, {format(reduced)}, {format(n50)}]</text>
          </g>
        )
        offset += h + gap
      }
    })
  }
  return (
    <g>
      {legendKey}
      {items}
    </g>
  )
}


// const MenuSummary = ({values,zAxis,bins,palette,other}) => {
//
//   let css = styles.long_menu_item
//   let counts = []
//   let reduced = []
//   let listDiv
//   if (bins){
//     bins.forEach((bin,i) => {
//       let title = bin.id
//       let color = palette.colors[i]
//       let value = values.counts.selBinned[i]
//       let total = values.counts.binned[i]
//       if (total){
//         counts[i] = <TabbedFraction key={i} {...{value,total,color,title}}/>
//         value = values.reduced.selBinned[i]
//         total = values.reduced.binned[i]
//         reduced[i] = <TabbedFraction key={i} {...{value,total,color,title}}/>
//       }
//     })
//     if (other){
//       let list = []
//       other.forEach((id,i) => {
//         list.push(<span key={i}><span className={styles.no_break}>{id}</span>, </span>)
//       })
//       listDiv = (<div className={css}>
//         <h3>Other Taxa</h3>
//         {list}
//       </div>)
//     }
//   }
//   return (
//     <div>
//       <div className={css}>
//         <h3>{zAxis}</h3>
//         <TabbedFraction value={values.reduced.sel} total={values.reduced.all}/>
//         {reduced}
//       </div>
//       <div className={css}>
//         <h3>counts</h3>
//         <TabbedFraction value={values.counts.sel} total={values.counts.all}/>
//         {counts}
//       </div>
//       {listDiv}
//     </div>
//   )
// }
