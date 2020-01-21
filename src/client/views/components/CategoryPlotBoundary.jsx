import React from 'react';
import { connect } from 'react-redux'
import { getMainPlotData }  from '../reducers/plotData'
import { plotText }  from '../reducers/plotStyles'
import styles from './Plot.scss'
import {Axis, axisPropsFromTickScale, LEFT, BOTTOM} from 'react-d3-axis';
import { scaleLinear as d3scaleLinear } from 'd3-scale';
import { scaleLog as d3scaleLog } from 'd3-scale';
import { format as d3Format } from 'd3-format'

export default class  CategoryPlotBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = () => {
      return (state, props) => (
        {
          plotText: plotText(state)
        }
      )
    }
  }

  render(){
    const ConnectedCategoryPlotBoundary = connect(
      this.mapStateToProps
    )(CategoryPlotBoundaryComponent)
    return (
      <ConnectedCategoryPlotBoundary {...this.props}/>
    )
  }
}

export const CategoryPlotBoundaryComponent = ({length,maxScore,plotText}) => {
  let xScale = d3scaleLinear().range([0,900]).domain([0,length])
  let yScale = d3scaleLinear().range([200,0]).domain([0,maxScore])
  let binSize = 100000
  let xTicks = Math.min(Math.floor(length/binSize),10)
  if (length < binSize * Math.sqrt(2)){
    xTicks = 1
  }
  else {
    xTicks = Math.max(2,xTicks)
  }
  let minorTicks = xTicks
  if (minorTicks < 5){
    minorTicks *= Math.round(10/minorTicks)
  }
  let fontSize = plotText.axisTick.fontSize
  let f = d3Format(".2s");
  return (
    <g>
      <Axis {...axisPropsFromTickScale(xScale, xTicks)} style={{orient: BOTTOM, tickFontSize: 0, tickSizeInner:200, tickSizeOuter:200, strokeColor:'#eee'}}/>
      <Axis {...axisPropsFromTickScale(yScale, 10)} format={f} style={{orient: LEFT, tickFontSize: fontSize}}/>
      <g transform={'translate(900)'} >
        <Axis {...axisPropsFromTickScale(yScale, 10)} style={{orient: LEFT, tickFontSize: 0, tickSizeInner:900, tickSizeOuter:900, strokeColor:'#eee'}}/>
      </g>
      <g transform={'translate(-50,100),rotate(-90)'}>
        <text className={styles.small_axis_title}>bitscore</text>
      </g>
      <g transform={'translate(0,200)'} >
        <Axis {...axisPropsFromTickScale(xScale, minorTicks)} format={f} style={{orient: BOTTOM, tickFontSize: fontSize}}/>
      </g>
      <g transform={'translate(450,250)'}>
        <text className={styles.small_axis_title}>position (bp)</text>
      </g>
      <rect className={styles.plot_boundary} x={0} y={0} width={900} height={200} fill='none'/>
    </g>
  )
}
