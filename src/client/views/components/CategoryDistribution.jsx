import React from 'react';
import { connect } from 'react-redux'
import styles from './Plot.scss'
import Spinner from './Spinner'
import { getCategoryDistributionForRecord } from '../reducers/record'
import { getBinnedColors } from '../reducers/summary'
import CategoryPlotBoundary from './CategoryPlotBoundary'
import CategoryLegend from './CategoryLegend'
import { scaleLinear as d3scaleLinear } from 'd3-scale';
import { scaleLog as d3scaleLog } from 'd3-scale';

const apiUrl = API_URL || '/api/v1'

class CatDistribution extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      values: [],
      hover: false
    }
  }

  render() {
    let points = this.props.data.lines
    if (!points || points.length < 1){
      return (<div className={styles.modal_plot_outer}>
                No category distribution data available for the current record.
              </div>)
    }
    let yLimit = this.props.data.yLimit || 10000
    let xLimit = this.props.data.xLimit || 1000000
    let xScale = d3scaleLinear().domain([0,xLimit]).range([0,900])
    let yScale = d3scaleLinear().domain([0,yLimit]).range([200,0])
    let viewbox = '0 0 1000 325'
    let lines = points.map((line,i)=>{
      let color = this.props.colors[line.cat] || this.props.data.otherColor
      let url
      if (line.link){
        url = line.link.url
      }
      return (
        <line
              x1={xScale(line.x1)}
              x2={xScale(line.x2)}
              y1={yScale(line.y1)+1}
              y2={yScale(line.y2)-1}
              key={i}
              onMouseOver={url ? ()=>this.setState({hover:line.link}) : ()=>{}}
              onMouseOut={url ? ()=>this.setState({hover:false}) : ()=>{}}
              onClick={url ? ()=>window.open(url,'_blank') : null}
              style={url ? {cursor:'pointer', pointerEvents:'auto'} : {}}
              strokeWidth={xScale(line.width) < 5 ? 5 : xScale(line.width)}
              fill='none'
              stroke={color}/>
      )
    })
    let info
    if (this.state.hover){
      info = 'accession: ' + this.state.hover.meta.subject
      info += ' [' + this.state.hover.title + ']'
    }
    return (
      <div className={styles.modal_plot_outer}>
        <svg id="record_plot"
          ref={(elem) => { this.svg = elem; }}
          className={styles.main_plot+' '+styles.fill_parent}
          viewBox={viewbox}
          preserveAspectRatio="xMinYMin">
          <g transform={'translate(75,5)'} >
            <text className={styles.plot_title}>{this.props.data.id}</text>
          </g>

          <g transform={'translate(75,50)'} >
            <CategoryPlotBoundary length={xLimit} maxScore={yLimit}/>
          </g>
          <g transform={'translate(75,50)'} >
            {lines}
          </g>
          <g transform={'translate(75,0)'} >
            <CategoryLegend categories={this.props.data.labels} colors={this.props.colors} otherColor={this.props.data.otherColor}/>
          </g>
          <g transform={'translate(74,30)'} className={styles.link_info}>
            {info && <rect width={902} height={21}/>}
            <g transform={'translate(450,5)'}>
              <text>{info}</text>
            </g>
          </g>
        </svg>
      </div>
    )
  }
}

class CategoryDistribution extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = state => {
      return {
        data: getCategoryDistributionForRecord(state),
        colors: getBinnedColors(state)
      }
    }
  }

  render(){
    const ConnectedCategoryDistribution = connect(
      this.mapStateToProps
    )(CatDistribution)
    return <ConnectedCategoryDistribution {...this.props}/>
  }
}

export default CategoryDistribution
