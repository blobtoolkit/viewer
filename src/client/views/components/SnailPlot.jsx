import React from 'react'
import { connect } from 'react-redux'
import styles from './Plot.scss'
import { cumulativeCurves } from '../reducers/summary'
import { getCircular, circularCurves } from '../reducers/summary'
import { getCurveOrigin, chooseCircumferenceScale, chooseRadiusScale } from '../reducers/plotParameters'
import { getSelectedDatasetMeta } from '../reducers/dataset'
import SnailPlotLegend from './SnailPlotLegend'
import SnailPlotScale from './SnailPlotScale'
import { format as d3format} from 'd3-format'
import Pointable from 'react-pointable';
import { scaleLinear as d3scaleLinear } from 'd3-scale';
import { arc as d3Arc } from 'd3-shape';
const saveSvgAsPng = require('save-svg-as-png/saveSvgAsPng.js')

const xScale = d3scaleLinear().range([-425,425])
const yScale = d3scaleLinear().range([425,-425])
const radialCoords = event => {
  let bounds = event.target.getBoundingClientRect();
  xScale.domain([bounds.left,bounds.right])
  yScale.domain([bounds.top,bounds.bottom])
  let x = xScale(event.clientX)
  let y = yScale(event.clientY)
  let theta = Math.atan2(x,y)
  theta = theta >= 0 ? theta : 2*Math.PI - Math.abs(theta)
  let h = Math.sqrt(x**2+y**2)
  return {theta,h}
}

const SegmentStats = ({theta,h,ratio,overlay,sums,nXlens,nXnums,gcs}) => {
  if (!overlay) return {}
  let cScale = d3scaleLinear().domain([0,2*Math.PI*ratio]).range([0,100])
  let start = Math.floor(cScale(theta))
  let end = start + 1
  let gc = {}, allGC = [], nX = {}, path
  if (start < 100){
    let innerRadius = 0
    let outerRadius = 350
    if (h >= 350){
      innerRadius = 350
      outerRadius = 425
      for (let i = start*10; i < end*10; i++){
        allGC = allGC.concat(gcs[i].gc)
      }
      gc.min = Math.min(...allGC)
      gc.max = Math.max(...allGC)
      gc.count = allGC.length
      gc.mean = allGC.reduce((a=0,b)=>a+b)/gc.count
    }
    else {
      start = 0
      nX.len = nXlens[end*10-1]
      nX.num = nXnums[end*10-1]
    }
    path = d3Arc()({
      startAngle: Math.PI * ratio * start / 50,
      endAngle: Math.PI * ratio * end / 50,
      innerRadius,
      outerRadius
    })
  }
  return ({pct:end,path,gc,nX})
}

const SnailSegment = ({path}) => (
  <path d={path}
        fill={'rgba(225,225,225,0.4)'}
        stroke={'none'}/>
)

class Snail extends React.Component {
  constructor(props) {
    super(props);
    let ratio = this.props.data.values.sum[999] / this.props.circular.scale.circumference
    this.state = {
      theta:3.14,
      h:320,
      ratio,
      overlay:false
    }
  }

  render(){
    let format = d3format(".2s")
    let pctFormat = d3format(".1%")
    let commaFormat = d3format(",")
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
    let segment
    let sums = this.props.data.values.sum
    let nXlens = this.props.data.values.nXlen
    let nXnums = this.props.data.values.nXnum
    let gcs = this.props.data.values.gc
    let stats = SegmentStats({...this.state,sums,gcs,nXlens,nXnums})
    let topLeft, topRight, bottomRight
    if (stats.path){
      segment = <SnailSegment path={stats.path}/>
      let list = legend.composition.map(l=>(
        {
          label:l.label,
          value:l.value,
          color:l.color
        }
      ))
      if (stats.gc && stats.gc.mean){
        let gcs = [stats.gc.mean,stats.gc.min,stats.gc.max]
        list[0].label = pctFormat(gcs[0])
        list[0].value = pctFormat(gcs[1])+'–'+pctFormat(gcs[2])
        list[1].label = pctFormat(1-gcs[0])
        list[1].value = pctFormat(1-gcs[2])+'–'+pctFormat(1-gcs[1])
      }
      bottomRight = <SnailPlotLegend title={'Composition'} list={list}/>
      if (stats.nX && stats.nX.len){
        let list = [{
          label: stats.nX.num + ' ' + this.props.meta.record_type + ' ≥ ' + commaFormat(stats.nX.len),
          color:'#999999'
        }]
        topRight = <SnailPlotLegend title={'N'+stats.pct} list={list}/>
      }
    }
    else {
      if (legend.composition){
        bottomRight = <SnailPlotLegend title={'Composition'} list={legend.composition}/>
      }
    }
    if (legend.stats){
      topLeft = <SnailPlotLegend title={'Scaffold statistics'} list={legend.stats}/>
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
            let fontSize = d.fontSize ? d.fontSize : '1.4em'
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
                    className={styles.axis_label}
                    style={{fontSize}}>
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
          <g transform={'translate(500,45)'} >
            <text className={styles.axis_title}>
              {this.props.meta.id}
            </text>
          </g>
          <g transform={'translate(500,500)'} >
            {paths}
            {segment}
          </g>
          <Pointable
            tagName='g'
            onPointerMove={(e)=>{
              e.preventDefault()
              let coords = radialCoords(e)
              this.setState({...coords,overlay:true})
            }}
            onPointerLeave={(e)=>{
              e.preventDefault()
              this.setState({overlay:false})
            }}
            onPointerDown={(e)=>{
              e.preventDefault()
              let coords = radialCoords(e)
              this.setState({...coords,overlay:true})
            }}
            onPointerUp={(e)=>{
              e.preventDefault()
              this.setState({overlay:false})
            }}
            >
            <circle
            r={425}
            cx={500}
            cy={500}
            fill='rgba(255,255,255,0)'
            stroke='none'
            style={{pointerEvents:'auto',stroke:'none'}} />
          </Pointable>
          <g transform={'translate(10,35)'} >
            {topLeft}
          </g>
          <g transform={'translate(10,860)'} >
            {bottomLeft}
          </g>
          <g transform={'translate(800,860)'} >
            {bottomRight}
          </g>
          <g transform={'translate(775,80)'} >
            {topRight}
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
        data: getCircular(state),
        circular: circularCurves(state),
        meta: getSelectedDatasetMeta(state,this.props.datasetId)
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
