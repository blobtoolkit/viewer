import React from 'react';
import { connect } from 'react-redux'
import { getBinnedLinesByCategoryForAxis }  from '../reducers/plotSquareBins'
import { getSummary }  from '../reducers/summary'
import styles from './Plot.scss'
import {Axis, axisPropsFromTickScale, LEFT, RIGHT} from 'react-d3-axis';
import { format as d3Format } from 'd3-format'
import { plotPaths, plotText } from './PlotStyles'

export default class PlotSideBinsSVG extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = () => {
      return (state, props) => {
        let lines = getBinnedLinesByCategoryForAxis(state,this.props.axis)
        let summary = getSummary(state)
        return {
          axis:this.props.axis,
          paths:lines.paths,
          scale:lines.zScale,
          sideLabel: summary.reducer+' '+summary.zAxis
        }
      }
    }
  }

  render(){
    const ConnectedSideBins = connect(
      this.mapStateToProps
    )(SideBinsSVG)
    return (
      <ConnectedSideBins axis={this.props.axis}/>
    )
  }
}

const AxisX = ({ scale, fontSize, label }) => {
  return (
    <g>
      <g style={plotText.axisTitle} transform='rotate(90) translate(150,80)'>
        <text>{label}</text>
      </g>
      <Axis {...axisPropsFromTickScale(scale, 5)} format={d3Format(".2s")} style={{orient: LEFT, tickFontSize: fontSize}}/>
    </g>
  )
}

const AxisY = ({ scale, fontSize, label }) => {
  return (
    <g transform='translate(1000)'>
      <g style={plotText.axisTitle} transform='rotate(-90) translate(-150,80)'>
        <text>{label}</text>
      </g>
      <Axis {...axisPropsFromTickScale(scale, 5)} format={d3Format(".2s")} style={{orient: RIGHT, tickFontSize: fontSize}}/>
    </g>
  )
}

const SideBinsSVG = ({ paths = [], axis='x',scale, sideLabel }) => {
  let params = {}
  params.transform = axis == 'x' ? 'translate(0,-300)' : 'translate(1300,0),rotate(90)'
  params.height = axis == 'x' ? 300 : 1000
  params.width = axis == 'x' ? 1000 : 300
  scale.domain(scale.domain().reverse())
  let fontSize = 16
  let tickMarks = <AxisX {...{scale,fontSize}} label={sideLabel}/>
  if (axis == 'y'){
    tickMarks = <AxisY {...{scale,fontSize}} label={sideLabel}/>
  }
  return (
    <g {...params}>
      {paths.map((path,i) =>
        <path style={plotPaths.sideBins} d={path.path} key={i} fill={path.color} stroke={path.color} color={path.color}  />
      )}
      <rect style={plotPaths.boundary} x={0} y={0} width={1000} height={300} fill='none'/>
      {tickMarks}
    </g>
  )
}
