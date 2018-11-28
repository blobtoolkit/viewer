import React from 'react';
import { connect } from 'react-redux'
import { getMainPlotData }  from '../reducers/plotData'
import styles from './Plot.scss'
import {Axis, axisPropsFromTickScale, LEFT, BOTTOM} from 'react-d3-axis';

export default class MainPlotBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = () => {
      return (state, props) => (
        getMainPlotData(state)
      )
    }
  }

  render(){
    const PlotBoundary = connect(
      this.mapStateToProps
    )(PlotOutline)
    return (
      <PlotBoundary/>
    )
  }
}

const PlotOutline = (data) => {
  let xRange = data.meta.x.range
  let xScale = data.meta.x.xScale.copy()
  xScale.range([50,950])
  let xBreak
  if (data.meta.x.meta.clamp){
    xBreak = <line className={styles.clamped_divider}
                   x1={104} x2={104} y1={-300} y2={1050}/>
  }
  let yBreak
  if (data.meta.y.meta.clamp){
    yBreak = <line className={styles.clamped_divider}
                   x1={-50} x2={1300} y1={896} y2={896}/>

  }
  let yRange = data.meta.y.range
  let yScale = data.meta.y.xScale.copy()
  yScale.range([950,50])
  let fontSize = 16
  return (
    <g>
      <rect className={styles.plot_boundary} x={0} y={0} width={1000} height={1000} fill='none'/>
      {xBreak}
      {yBreak}
      <Axis {...axisPropsFromTickScale(xScale, 10)} style={{orient: BOTTOM, tickFontSize: 0}}/>
      <Axis {...axisPropsFromTickScale(yScale, 10)} style={{orient: LEFT, tickFontSize: fontSize}}/>
      <g  transform={'translate(1000)'} >
        <Axis {...axisPropsFromTickScale(yScale, 10)} style={{orient: LEFT, tickFontSize: 0}}/>
      </g>
      <g  transform={'translate(0,1000)'} >
        <Axis {...axisPropsFromTickScale(xScale, 10)} style={{orient: BOTTOM, tickFontSize: fontSize}}/>

      </g>
    </g>
  )
}
