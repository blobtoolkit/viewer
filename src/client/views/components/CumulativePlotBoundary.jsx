import React from 'react';
import { connect } from 'react-redux'
import { getMainPlotData }  from '../reducers/plotData'
import styles from './Plot.scss'
import {Axis, axisPropsFromTickScale, LEFT, BOTTOM} from 'react-d3-axis';
import { scaleLinear as d3scaleLinear } from 'd3-scale';
import { format as d3Format } from 'd3-format'

export const CumulativePlotBoundary = (yValues,yLabel) => {
  yValues = yValues.yValues
  let xScale = d3scaleLinear().range([50,950]).domain([0,yValues.length])
  let yScale = d3scaleLinear().range([950,50]).domain([0,yValues[yValues.length - 1]])
  let fontSize = 16
  let f = d3Format(".2s");
  return (
    <g>
      <rect className={styles.plot_boundary} x={0} y={0} width={1000} height={1000} fill='none'/>
      <Axis {...axisPropsFromTickScale(xScale, 10)} style={{orient: BOTTOM, tickFontSize: 0}}/>
      <Axis {...axisPropsFromTickScale(yScale, 10)} format={f} style={{orient: LEFT, tickFontSize: fontSize}}/>
      <g  transform={'translate(1000)'} >
        <Axis {...axisPropsFromTickScale(yScale, 10)} style={{orient: LEFT, tickFontSize: 0}}/>
      </g>
      <g  transform={'translate(0,1000)'} >
        <Axis {...axisPropsFromTickScale(xScale, 10)} format={f} style={{orient: BOTTOM, tickFontSize: fontSize}}/>
      </g>
    </g>
  )
}

export default CumulativePlotBoundary