import React from 'react';
import { connect } from 'react-redux'
import { getSummary }  from '../reducers/summary'
import { getDatasetID } from '../reducers/location'
import { getDatasetMeta } from '../reducers/repository'
import styles from './Plot.scss'
import { format as d3format} from 'd3-format'
import { plotText } from './PlotStyles'

export default class PlotLegend extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = () => {
      return (state, props) => {
        let summary = getSummary(state)
        let id = getDatasetID(state)
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
  let commaFormat = d3format(",")
  if (bins){
    let offset = 20
    let w = 19
    let h = 19
    let gap = 5
    ds = (
      <g transform={'translate('+0+','+0+')'}>
        <text style={plotText.legendTitle}>{meta.name}</text>
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
        <text transform={'translate(260)'}
              style={Object.assign({}, plotText.legend, {textAnchor:'end',fontWeight:'normal'})}>
          [{headers.join('; ')}]
        </text>
      </g>
    )
    let title = 'total'
    let color = '#999'
    let numbers = []
    let count = values.counts.all > 0
    numbers.push(commaFormat(values.counts.all))
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
          <text style={plotText.legend} transform={'translate('+(w+gap)+','+(h-gap)+')'}>{title}</text>
          <text style={Object.assign({}, plotText.legend, {textAnchor:'end'})} transform={'translate('+(w+gap+260)+','+(h-gap)+')'}>[{numbers.join('; ')}]</text>
        </g>
      )
      offset += h + gap
    }
    bins.forEach((bin,i) => {
      let title = bin.id
      let color = palette.colors[i]
      let numbers = []
      let count = values.counts.binned[i] > 0
      numbers.push(commaFormat(values.counts.binned[i]))
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
            <text style={plotText.legend} transform={'translate('+(w+gap)+','+(h-gap)+')'}>{title}</text>
            <text style={Object.assign({}, plotText.legend, {textAnchor:'end'})} transform={'translate('+(w+gap+260)+','+(h-gap)+')'}>[{numbers.join('; ')}]</text>
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
