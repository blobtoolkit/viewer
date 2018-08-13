import React from 'react';
import { connect } from 'react-redux'
import { getMainPlotData }  from '../reducers/plotData'
import styles from './Plot.scss'
import {Axis, axisPropsFromTickScale, LEFT, RIGHT, TOP, BOTTOM} from 'react-d3-axis';
import { getPreviewDataForFieldId } from '../reducers/field'
import { format as d3format} from 'd3-format'

export default class PreviewPlotBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = () => {
      return (state, props) => (
        getPreviewDataForFieldId(state,props.xLabel) || {}
      )
    }
  }

  render(){
    const PlotBoundary = connect(
      this.mapStateToProps
    )(PlotOutline)
    return (
      <PlotBoundary {...this.props}/>
    )
  }
}

class PlotOutline extends React.Component {
  render(){
    if (!this.props.bars) return (<g></g>)
    let yScale = this.props.yScale.copy()
    let height = this.props.dimensions.height
    let width = this.props.dimensions.width
    yScale.range([height,0])
    yScale.domain([0,this.props.max])
    let fontSize = 16/2.5
    let format = d3format(".2s")
    let altFormat = d3format(".2f")
    let xScale = this.props.details.xScale.copy()
    let ticks, labels
    if (this.props.details.type == 'variable'){
      let count = 25
      xScale.range([0,count])
      let thresh = Array.from(Array(count-1).keys()).map((n)=>{let v = xScale.invert((n+1)); return v > 0.001 && v < 1 ? altFormat(v) : format(v)});
      ticks = this.props.bars.map((bar,i)=>{
        let x = bar.x
        return (
          <line key={i} stroke='black' x1={x} x2={x} y2={6}/>
        )
      })
      let w = width / count
      labels = thresh.map((t,i)=>{
        return (
          <text transform={'translate('+(w+i*w)+',10),rotate(90)'} key={i} textAnchor='start' dominantBaseline='middle' style={{fontSize}}>{t}</text>
        )
      })
      ticks = ticks.slice(1)
    }
    else if (this.props.details.type == 'category'){
      let count = 10
      xScale.range([0,count])
      let thresh = Array.from(Array(count-1).keys()).map((n)=>{let v = xScale.invert((n+1)); return v > 0.001 && v < 1 ? altFormat(v) : format(v)});
      ticks = this.props.bars.map((bar,i)=>{
        let x = bar.x
        return (
          <line key={i} stroke='black' x1={x} x2={x} y2={6}/>
        )
      })
      let w = width / count
      labels = this.props.bins.map((bin,i)=>{
        return (
          <text transform={'translate('+(w/2+i*w)+',5),rotate(90)'} key={i} textAnchor='start' dominantBaseline='middle' style={{fontSize}}>{bin.id}</text>
        )
      })
      ticks = ticks.slice(1)
    }

    return (
      <g>
        <g  transform={'translate(-5)'} >
          <Axis {...axisPropsFromTickScale(yScale, 4)} style={{orient: LEFT, tickFontSize: fontSize}} format={format}/>
        </g>
        <g  transform={'translate('+(width+5)+')'} >
          <Axis {...axisPropsFromTickScale(yScale, 4)} style={{orient: RIGHT, tickFontSize: 0}}/>
        </g>
        <g  transform={'translate(0,'+(height+5)+')'} >
          <line stroke='black' x2={width}/>
          {ticks}
          {labels}
          <text transform={'translate('+(width/2)+',65)'} textAnchor='middle'>{this.props.xLabel}</text>
        </g>

      </g>
    )
  }
}
