import React from 'react'
import { connect } from 'react-redux'
import styles from './Plot.scss'
import { cumulativeCurves } from '../reducers/summary'
import PlotLegend from './PlotLegend'
import PlotAxisTitle from './PlotAxisTitle'
import CumulativePlotBoundary from './CumulativePlotBoundary'
import { getSelectedDatasetMeta } from '../reducers/dataset'
const saveSvgAsPng = require('save-svg-as-png/saveSvgAsPng.js')
import AxisTitle from './AxisTitle'

class Cumulative extends React.Component {
  render(){
    let viewbox = '0 0 1110 1110'
    let legend = <g transform='translate(700,720)'><PlotLegend/></g>
    let colors = this.props.cumulative.palette.colors
    let all = this.props.cumulative.paths.all
    let yValues = this.props.cumulative.values.all
    let byCat = this.props.cumulative.paths.byCat
    let yLabel = 'Cumulative ' + this.props.cumulative.zAxis
    let xLabel = (this.props.meta.record_type || '') + ' number'
    let paths = byCat.map((d,i)=>(
      <path className={styles.bold_path}
            d={d}
            key={i}
            fill='none'
            stroke={colors[i]}/>
    ))
    return (
      <div className={styles.outer}>
        <svg id="cumulative_plot"
          ref={(elem) => { this.svg = elem; }}
          className={styles.main_plot+' '+styles.fill_parent}
          viewBox={viewbox}
          preserveAspectRatio="xMidYMid meet">
          <g transform={'translate(100,10)'} >
            <path className={styles.bold_path}
                  d={all}
                  fill='none'
                  stroke='#999'/>
            {paths}
            {legend}
            <CumulativePlotBoundary yValues={yValues}/>
            <AxisTitle axis='y' title={yLabel}/>
            <AxisTitle axis='x' title={xLabel}/>
          </g>
        </svg>
        <a className={styles.save_svg} onClick={()=>(saveSvgAsPng.saveSvg(document.getElementById("cumulative_plot"),"cumulative_plot.svg"))}>save image</a>
      </div>
    )
  }
}

class CumulativePlot extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = state => {
      return {
        cumulative: cumulativeCurves(state),
        meta: getSelectedDatasetMeta(state,this.props.datasetId)
      }
    }
  }

  render(){
    const ConnectedCumulative = connect(
      this.mapStateToProps
    )(Cumulative)
    return <ConnectedCumulative {...this.props}/>
  }
}

export default CumulativePlot