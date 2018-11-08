import React from 'react';
import { connect } from 'react-redux'
import { getMainPlotData }  from '../reducers/plotData'
import styles from './Plot.scss'
import {Axis, axisPropsFromTickScale, LEFT, BOTTOM} from 'react-d3-axis';
import { scaleLinear as d3scaleLinear } from 'd3-scale';
import { scaleLog as d3scaleLog } from 'd3-scale';
import { format as d3Format } from 'd3-format'

export const CategoryPlotBoundary = ({length,maxScore}) => {
  let xScale = d3scaleLinear().range([0,900]).domain([0,length])
  let yScale = d3scaleLinear().range([200,0]).domain([0,maxScore])
  let binSize = 100000
  let xTicks = Math.min(Math.round(length/binSize),10)
  let fontSize = 16
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
        <Axis {...axisPropsFromTickScale(xScale, xTicks)} format={f} style={{orient: BOTTOM, tickFontSize: fontSize}}/>
      </g>
      <g transform={'translate(450,250)'}>
        <text className={styles.small_axis_title}>position (bp)</text>
      </g>
      <rect className={styles.plot_boundary} x={0} y={0} width={900} height={200} fill='none'/>
    </g>
  )
}

export default CategoryPlotBoundary
