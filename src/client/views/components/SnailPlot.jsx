import React from 'react'
import { connect } from 'react-redux'
import styles from './Plot.scss'
import { cumulativeCurves } from '../reducers/summary'
import { circularCurves } from '../reducers/summary'
import { getCurveOrigin, chooseCircumferenceScale, chooseRadiusScale } from '../reducers/plotParameters'
import { getSelectedDatasetMeta } from '../reducers/dataset'
import SnailPlotLegend from './SnailPlotLegend'
import SnailPlotScale from './SnailPlotScale'
import { format as d3format} from 'd3-format'
const saveSvgAsPng = require('save-svg-as-png/saveSvgAsPng.js')

class Snail extends React.Component {
  render(){
    let format = d3format(".2s")
    let viewbox = '0 0 1000 1000'
    let pathProps = this.props.circular.pathProps
    let paths = []
    let legend = this.props.circular.legend
    let bottomLeft = (
      <SnailPlotScale
        title={'Scale'}
        scale={this.props.circular.scale}
        onChangeCircumference={this.props.onChangeCircumference}
        onChangeRadius={this.props.onChangeRadius}
      />
    )
    let topLeft, bottomRight
    if (legend.stats){
      topLeft = <SnailPlotLegend title={'Scaffold statistics'} list={legend.stats}/>
    }
    if (legend.composition){
      bottomRight = <SnailPlotLegend title={'Composition'} list={legend.composition}/>
    }
    Object.keys(this.props.circular.paths).forEach((k,i)=>{
      let d = this.props.circular.paths[k]
      paths.push(
        <path d={d}
              key={k}
              fill={pathProps[k].fill}
              stroke={pathProps[k].stroke}
              strokeWidth={pathProps[k].strokeWidth || 2}
              strokeDasharray={pathProps[k].strokeDasharray || null}
              strokeLinecap='round'/>
      )
    })
    let axes = this.props.circular.axes
    Object.keys(axes).forEach((k,i)=>{
      let axis = axes[k]
      paths.push(
        <path className={styles.axis_path}
              d={axis.path}
              key={k}
              fill='none'
              stroke='black'
              strokeLinecap='round'/>
      )
      if (axis.ticks){
        axis.ticks.major.forEach((d,idx) => {
          paths.push(
            <path className={styles.axis_path}
                  d={d}
                  key={k+'_major_'+idx}
                  fill='none'
                  stroke='black'
                  strokeLinecap='round'/>
          )
        })
        axis.ticks.minor.forEach((d,idx) => {
          paths.push(
            <path className={styles.fine_path}
                  d={d}
                  key={k+'_minor_'+idx}
                  fill='none'
                  stroke='black'
                  strokeLinecap='round'/>
          )
        })
        if (axis.ticks.labels){
          axis.ticks.labels.forEach((d,idx) => {
            let textAnchor = 'middle'
            let startOffset = '50%'
            if (d.align == 'left'){
              textAnchor = 'left'
              startOffset = 0
            }
            if (d.align == 'right'){
              textAnchor = 'end'
              startOffset = '100%'
            }
            paths.push(
              <path className={styles.axis_path}
                    d={d.path}
                    key={k+'_path_'+idx}
                    id={k+'_path_'+idx}
                    fill='none'
                    stroke='none'/>
            )
            paths.push(
              <text key={k+'_text_'+idx}
                    className={styles.axis_label}>
                <textPath
                    xlinkHref={'#'+k+'_path_'+idx}
                    textAnchor={textAnchor}
                    startOffset={startOffset}>
                  {d.text}
                </textPath>
              </text>
            )
          })
        }
      }
    })
    return (
      <div className={styles.outer}>
        <svg id="snail_plot"
          ref={(elem) => { this.svg = elem; }}
          className={styles.main_plot+' '+styles.fill_parent}
          viewBox={viewbox}
          preserveAspectRatio="xMidYMid meet">
          <g transform={'translate(500,500)'} >
            {paths}
          </g>
          <g transform={'translate(10,35)'} >
            {topLeft}
          </g>
          <g transform={'translate(10,825)'} >
            {bottomLeft}
          </g>
          <g transform={'translate(825,825)'} >
            {bottomRight}
          </g>
        </svg>
        <a className={styles.save_svg} onClick={()=>(saveSvgAsPng.saveSvg(document.getElementById("snail_plot"),"snail_plot.svg"))}>save image</a>
      </div>
    )
  }
}

class SnailPlot extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = state => {
      return {
        cumulative: cumulativeCurves(state),
        circular: circularCurves(state),
        meta: getSelectedDatasetMeta(state,this.props.datasetId),
        origin: getCurveOrigin(state)
      }
    }
    this.mapDispatchToProps = dispatch => {
      return {
        onChangeCircumference: (value)=>dispatch(chooseCircumferenceScale(value)),
        onChangeRadius: (value)=>dispatch(chooseRadiusScale(value))
      }
    }
  }

  render(){
    const ConnectedSnail = connect(
      this.mapStateToProps,
      this.mapDispatchToProps
    )(Snail)
    return <ConnectedSnail {...this.props}/>
  }
}

export default SnailPlot
