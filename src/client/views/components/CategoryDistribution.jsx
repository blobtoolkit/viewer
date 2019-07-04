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
      if (line.link && line.link.url){
        url = line.link.url
      }
      let connector
      if (line.previous){
        connector = <line
              x1={xScale(points[line.previous].x1)}
              x2={xScale(line.x2)}
              y1={yScale(points[line.previous].y1)+1}
              y2={yScale(line.y2)-1}
              strokeWidth={2}
              strokeDasharray='3 3'
              fill='none'
              stroke='rgba(0,0,0,0.1)'/>
      }
      return (
        <g key={i}>
          {connector}
          <line
                x1={xScale(line.x1)}
                x2={xScale(line.x2)}
                y1={yScale(line.y1)+1}
                y2={yScale(line.y2)-1}
                onMouseOver={line.link ? ()=>this.setState({hover:line.link}) : ()=>{}}
                onMouseOut={line.link ? ()=>this.setState({hover:false}) : ()=>{}}
                onClick={url ? ()=>window.open(url,'_blank') : null}
                style={line.link ? url ? {cursor:'pointer', pointerEvents:'auto'} : {pointerEvents:'auto'} : {}}
                strokeWidth={xScale(line.width) < 5 ? 5 : xScale(line.width)}
                fill='none'
                stroke={color}/>
        </g>

      )
    })
    let taxon
    let accession
    let score
    let position
    if (this.state.hover && this.state.hover.meta){
      taxon = 'Taxon: ' + this.state.hover.meta.taxon
    }
    if (this.state.hover && this.state.hover.title){
      accession = 'Accession: ' + this.state.hover.meta.subject
      accession += ' [' + this.state.hover.title + ']'
    }
    if (this.state.hover && this.state.hover.meta){
      score = 'Bitscore: ' + this.state.hover.meta.score.toLocaleString()
      score += ' [' + this.state.hover.meta.start.toLocaleString()
      score += '–' + this.state.hover.meta.end.toLocaleString() + ' bp]'
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
          {score && <g transform={'translate(624,0)'} className={styles.link_info} style={{fontSize:12}}>
            <rect width={352} height={20}/>
            {score && <g transform={'translate(330,5)'}>
              <text style={{textAnchor:'end'}}>{score}</text>
            </g>}
            {position && <g transform={'translate(330,20)'}>
              <text style={{textAnchor:'end'}}>{position}</text>
            </g>}
          </g>}
          {taxon && <g transform={'translate(624,20)'} className={styles.link_info} style={{fontSize:12}}>
            <rect width={352} height={30}/>
            {accession && <g transform={'translate(330,0)'}>
              <text style={{textAnchor:'end'}}>{accession}</text>
            </g>}
            {taxon && <g transform={'translate(330,15)'}>
              <text style={{textAnchor:'end'}}>{taxon}</text>
            </g>}
          </g>}
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
