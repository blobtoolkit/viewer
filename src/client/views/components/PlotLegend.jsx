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
  let format = d3format(".2s")
  if (bins){
    let offset = 0
    let w = 20
    let h = 20
    let gap = 5
    bins.forEach((bin,i) => {
      let title = bin.id
      let color = palette.colors[i]
      let count = values.counts.binned[i]
      let reduced = values.reduced.binned[i]
      if (count){
        items.push(
          <g key={i}>
            <rect x={0} y={offset} width={w} height={h} style={{fill:color}} />
            <text transform={'translate('+(w+gap)+','+(h+offset)+')'}>
              <tspan>{title} </tspan>
              <tspan>[{format(count)}, {format(reduced)}]</tspan>
            </text>
          </g>
        )
        offset += h + gap
      }
    })
  }
  return (
    <g>
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
