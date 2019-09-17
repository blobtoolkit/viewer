import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from './Caption.scss';
import {getZScale, getZReducer, getCurveOrigin, getScaleTo } from '../reducers/plotParameters'
import { getAllActiveFilters, getActiveSelection } from '../reducers/filter'

const scales = {
  scaleSqrt: 'square-root',
  scaleLinear: 'linear',
  scaleLog: 'logarithmic'
}

const labels = {
  gc: 'GC proportion',
  length: 'length',
  ncount: 'N count',
  cov: 'coverage',
  cindex: 'c-index',
  score: 'bitscore'
}

class Caption extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expand:false
    }
  }

  capitalise(str) {
    return str[0].toUpperCase() + str.slice(1);
  }

  axis(str){
    let parts = str.split('_')
    let label
    if (parts.length == 1){
      label = labels[str]
    }
    else {
      if (parts[parts.length-1] == 'cov'){
        let type = 'base'
        if (parts[parts.length-2] == 'read'){
          type = 'read'
        }
        label = `${type} ${labels.cov} in ${parts[0]}`
      }
      else if (parts.length == 3){
        label = `${parts[1]} ${labels[parts[2]]}`
      }
      else {
        label = `${parts[1]}`
      }
    }
    return label
  }

  scaleStr(str) {

    return scales[str]
  }



  render(){
    if (!this.props.active || this.props.active == 'loading'){
      return null
    }
    let title = ''
    let caption = ''
    let record = this.props.meta.record_type || 'contig'
    let z = labels[this.props.plot.axes.z]
    let [taxrule, cat] = this.props.plot.axes.cat.split('_')
    if (this.props.view == 'blob'){
      let shape = this.props.plotShape
      if (shape == 'hex'){
        shape = 'hexagon'
      }
      let plot = 'Blob'
      let yaxis = this.axis(this.props.plot.axes.y)
      if (!yaxis) return null
      let xaxis = this.axis(this.props.plot.axes.x)
      let scale = scales[this.props.scale]
      let range
      let reducer = this.props.reducer.id
      if (this.props.plotShape != 'circle'){
        range = this.props.zScale.domain().map(x=>Number(x).toLocaleString())
        plot = `${this.capitalise(shape)}-binned blob`
      }
      else {
        range = this.props.range.map(x=>Number(x).toLocaleString())
      }
      title = `${plot} plot of ${yaxis} against ${xaxis} for ${record}s in assembly ${this.props.datasetName}. `
      caption = `${this.capitalise(record)}s are coloured by ${cat}`
      if (this.props.plotShape != 'circle'){
        caption += ` and binned at a resolution of ${this.props.binned.grid.res} divisions on each axis`
        caption += `. Coloured ${shape}s within each bin are sized in proportion to the ${reducer} of individual ${record} ${z}s `
      }
      else {
        caption += `. Circles are sized in proportion to ${record} ${z} `
      }
      caption += `on a ${scale} scale,
                  ranging from ${range[0]} to ${range[1]}. `
      caption += `Histograms show the distribution of ${record} ${z} ${reducer} along each axis. `

    }
    else if (this.props.view == 'cumulative') {
      title = `Cumulative ${record} ${z} for assembly ${this.props.datasetName}. `
      caption = `The grey line shows cumulative length for all ${record}s. `
      caption += `Coloured lines show cumulative lengths of ${record}s assigned to each ${cat} using the ${taxrule} taxrule`
      if (this.props.curveOrigin != 0){
        caption += ` and are stacked by cumulative value on the ${this.props.curveOrigin}-axis to show the proportion of each ${cat} in the overall assembly. `
      }
      else {
        caption += '. '
      }
    }
    else if (this.props.view == 'snail'){
      let longest = this.props.data.values.nXnum[0] == 1 ? this.props.data.values.nXlen[0] : false
      let n50 = this.props.data.values.nXlen[499]
      let n90 = this.props.data.values.nXlen[899]
      let radius = this.props.circular.scale.radius
      let span = this.props.circular.scale.circumference
      title = `Snail plot summary of assembly statistics for assembly ${this.props.datasetName}. `
      caption = `The main plot is divided into 1,000 size-ordered bins around the circumference with each bin representing 0.1% of the ${span.toLocaleString()} bp assembly. `
      caption += `The distribution of ${record} lengths is shown in dark grey with `
      caption += `the plot radius scaled to the longest ${record} present in the assembly (${radius.toLocaleString()} bp`
      if (longest && longest == radius){
        caption += `, shown in red). `
      }
      else if (longest){
        caption += `). The red segment shows the longest scaffold in the filtered assembly (${longest.toLocaleString()} bp). `
      }
      else {
        caption += `). `
      }
      caption += `Orange and pale-orange arcs show the N50 and N90 ${record} lengths (${n50.toLocaleString()} and ${n90.toLocaleString()} bp), respectively. `
      caption += `The pale grey spiral shows the cumulative ${record} count on a log scale with white scale lines showing successive orders of magnitude. `
      caption += `The blue`
      if (this.props.data.composition.n > 0.1){
        caption += `, pale-blue and white `
      }
      else {
        caption += ` and pale-blue `
      }
      caption += ` area around the outside of the plot shows the distribution of GC, AT and N percentages in the same bins as the inner plot. `
      if (this.props.buscoMeta){
        caption += `A summary of complete, fragmented, duplicated and missing BUSCO genes in the ${this.props.buscoMeta.meta.set} set is shown in the top right. `
      }
    }
    if (this.props.filters.length > 0){
      caption += `The assembly has been filtered to exclude${this.props.filters.length > 1 ? ':' : ''} ${record}s with `
      let filters = this.props.filters.map(o=>{
        let name = this.axis(o.id)
        if (o.type == 'in'){
          return `${name} < ${o.range[0].toLocaleString()} or > ${o.range[1].toLocaleString()}`
        }
        else if (o.type == 'out'){
          return `${name} > ${o.range[0].toLocaleString()} and < ${o.range[1].toLocaleString()}`
        }
        else if (o.type == 'lt'){
          return `${name} > ${o.value.toLocaleString()}`
        }
        else if (o.type == 'gt'){
          return `${name} < ${o.value.toLocaleString()}`
        }
        else if (o.type == 'cat'){
          if (o.list.length == 1){
            return `${name} matches ${o.list[0]}`
          }
          else {
            return `${name} in ${o.list.slice(0, -1).join(', ')} or ${o.list.slice(-1)}`
          }
        }
        else if (o.type == 'nocat'){
          if (o.list.length == 1){
            return `${name} does not match ${o.list[0]}`
          }
          else {
            return `${name} not in ${o.list.slice(0, -1).join(', ')} or ${o.list.slice(-1)}`
          }
        }
        return name
      })
      if (filters.length > 1){
        caption += `${filters.slice(0, -1).join('; ')}; or ${filters.slice(-1)}. `
      }
      else {
        caption += `${filters.join('; or ')}. `
      }

    }

    if (this.props.selection.length > 0){
      caption += `A selection-based filter containing ${this.props.selection.length} ${record}s has been applied to the assembly. `
    }

    if ((this.props.view == 'cumulative' || this.props.view == 'snail')
        && this.props.scaleTo == 'filtered'){
      caption += `Plot axes are scaled to the filtered assembly. `
    }

    let more = <span className={styles.expand} onClick={()=>this.setState({expand:true})}> More...</span>
    let less = <span className={styles.expand} onClick={()=>this.setState({expand:false})}> ...Less</span>

    return (
      <div className={styles.outer}>
        <span className={styles.title}>{title}</span>
        {this.state.expand ? caption : more}
        {this.state.expand && less}
      </div>
    )
  }
}

class FigureCaption extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = state => {
      return {
        reducer: getZReducer(state),
        scale: getZScale(state),
        curveOrigin: getCurveOrigin(state),
        scaleTo: getScaleTo(state),
        filters: getAllActiveFilters(state),
        selection: getActiveSelection(state)
      }
    }
    this.mapDispatchToProps = dispatch => {
      return {

      }
    }
  }

  render(){
    const ConnectedCaption = connect(
      this.mapStateToProps,
      this.mapDispatchToProps
    )(Caption)
    return (
      <ConnectedCaption {...this.props}/>
    )
  }
}

export default FigureCaption
