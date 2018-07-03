import React from 'react';
import { connect } from 'react-redux'
import { getSummary }  from '../reducers/summary'
import { getSelectedDataset } from '../reducers/dataset'
import { getDatasetMeta } from '../reducers/repository'
import styles from './Plot.scss'
import { format as d3format} from 'd3-format'

export default class PlotLegend extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = () => {
      return (state, props) => {
        let summary = getSummary(state)
        let id = getSelectedDataset(state)
        let meta = getDatasetMeta(state,id)
        return {meta,...summary}
      }
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

const Legend = ({values,zAxis,bins,palette,other,reducer,meta}) => {
  let items = []
  let legendKey
  let ds
  let format = d3format(".2s")
  if (bins){
    let offset = 10
    let w = 19
    let h = 19
    let gap = 5
    ds = (
      <g transform={'translate('+0+','+0+')'}>
        <text className={styles.legend_title}>{meta.name}</text>
      </g>
    )
    let headers = ['count']
    if (reducer != 'count'){
      headers.push(reducer+' '+zAxis)
    }
    if (zAxis == 'length'){
      headers.push('n50')
    }
    legendKey = (
      <g transform={'translate('+(w+gap)+','+(offset-gap)+')'}>
        <text className={styles.legend} transform={'translate(260)'} style={{textAnchor:'end',fontWeight:'normal'}}>[{headers.join(', ')}]</text>
      </g>
    )
    let title = 'total'
    let color = '#999'
    let numbers = []
    let count = values.counts.all > 0
    numbers.push(values.counts.all)
    if (reducer != 'count'){
      numbers.push(format(values.reduced.all))
    }
    if (zAxis == 'length'){
      numbers.push(format(values.n50.all))
    }
    if (count){
      items.push(
        <g key='all' transform={'translate(0,'+offset+')'}>
          <rect x={0} y={0} width={w} height={h} style={{fill:color,stroke:'black'}} />
          <text className={styles.legend} transform={'translate('+(w+gap)+','+(h-gap)+')'}>{title}</text>
          <text className={styles.legend} transform={'translate('+(w+gap+260)+','+(h-gap)+')'} style={{textAnchor:'end'}}>[{numbers.join(', ')}]</text>
        </g>
      )
      offset += h + gap
    }
    bins.forEach((bin,i) => {
      let title = bin.id
      let color = palette.colors[i]
      let numbers = []
      let count = values.counts.binned[i] > 0
      numbers.push(values.counts.binned[i])
      if (reducer != 'count'){
        numbers.push(format(values.reduced.binned[i]))
      }
      if (zAxis == 'length'){
        numbers.push(format(values.n50.binned[i]))
      }
      if (count){
        items.push(
          <g key={i} transform={'translate(0,'+offset+')'}>
            <rect x={0} y={0} width={w} height={h} style={{fill:color,stroke:'black'}} />
            <text className={styles.legend} transform={'translate('+(w+gap)+','+(h-gap)+')'}>{title}</text>
            <text className={styles.legend} transform={'translate('+(w+gap+260)+','+(h-gap)+')'} style={{textAnchor:'end'}}>[{numbers.join(', ')}]</text>
          </g>
        )
        offset += h + gap
      }
    })
  }
  return (
    <g>
      {ds}
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
