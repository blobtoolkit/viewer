import React from 'react'
import { connect } from 'react-redux'
import { getPlotShape, getPlotGraphics } from '../reducers/plotParameters'
import styles from './Plot.scss'
import MainPlotBox from './MainPlotBox'
import PlotBubblesCanvasLayers from './PlotBubblesCanvasLayers'
import PlotBubblesSVG from './PlotBubblesSVG'
//import PlotSquareBinsCanvas from './PlotSquareBinsCanvas'
import PlotSquareBinsSVG from './PlotSquareBinsSVG'
import PlotSquareGridSVG from './PlotSquareGridSVG'
//import PlotHexBinsCanvas from './PlotHexBinsCanvas'
import PlotHexBinsSVG from './PlotHexBinsSVG'
import PlotHexGridSVG from './PlotHexGridSVG'
import PlotAxisTitle from './PlotAxisTitle'
import PlotParameters from './PlotParameters'
import PlotTransformLines from './PlotTransformLines'
import PlotSideBinsSVG from './PlotSideBinsSVG'
import Pointable from 'react-pointable';
import { getScatterPlotDataByHexBin } from '../reducers/plotHexBins'
import { pixel_to_oddr } from '../reducers/hexFunctions'
import { addRecords, removeRecords } from '../reducers/select'
import * as d3 from 'd3'

export default class MainPlot extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = () => {
      return (state, props) => {
        return {
          plotShape:getPlotShape(state),
          plotGraphics:getPlotGraphics(state),
          hexes: getScatterPlotDataByHexBin(state).hexes,
          radius: getScatterPlotDataByHexBin(state).radius
        }
      }
    }
    this.mapDispatchToProps = dispatch => {
      return {
        addRecords:(arr) => dispatch(addRecords(arr)),
        removeRecords:(arr) => dispatch(removeRecords(arr))
      }
    }
  }

  render(){
    const ConnectedMainPlot = connect(
      this.mapStateToProps,
      this.mapDispatchToProps
    )(PlotBox)
    return (
      <ConnectedMainPlot />
    )
  }
}

const xScale = d3.scaleLinear().range([-55.556,955.556])
const yScale = d3.scaleLinear().range([-55.556,955.556])

const relativeCoords = event => {
  let bounds = event.target.getBoundingClientRect();
  //let width = bounds.right - bounds.left;
  xScale.domain([bounds.left,bounds.right])
  yScale.domain([bounds.top,bounds.bottom])
  let x = xScale(event.clientX)
  let y = yScale(event.clientY)
  //let height = bounds.bottom - bounds.top;
  //let x = ((event.clientX - bounds.left) - width * 0.05) / (width * 0.9) * 1000;
  //let y = ((event.clientY - bounds.top) - height * 0.05) / (height * 0.9) * 1000;
  console.log({x,y})
  return {x,y}
}

class PlotBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {mouseDown:false,addRecords:true}
  }

  setMouseDown(bool){
    this.setState({mouseDown:bool})
  }

  setAddRecords(bool){
    this.setState({addRecords:bool})
  }

  toggleSelection(arr){
    if (this.state.addRecords){
      this.props.addRecords(arr)
    }
    else {
      this.props.removeRecords(arr)
    }
  }

  getHexByPixel(x,y,radius){
    let oddr = pixel_to_oddr(x,y,radius)
    let hex = {id:null,ids:[]}
    if (this.props.hexes[oddr.i] && this.props.hexes[oddr.i][oddr.j]){
      hex = this.props.hexes[oddr.i][oddr.j]
    }
    return hex
  }

  render(){
    let plotContainer
    let plotGrid
    let hexes = {}
    let viewbox = '-100 -320 1420 1420'
    let xPlot = <PlotSideBinsSVG axis='x'/>
    let yPlot = <PlotSideBinsSVG axis='y'/>
    if (this.props.plotShape == 'circle'){
      //if (this.props.plotGraphics == 'canvas'){
        plotContainer = <PlotBubblesCanvasLayers />
      //}
      //plotContainer = <PlotBubblesSVG />
    }
    else if (this.props.plotShape == 'square'){
      if (this.props.plotGraphics == 'canvas'){
        //plotContainer = <PlotSquareBinsCanvas />
      }
      plotContainer = <PlotSquareBinsSVG />
      //plotContainer = <PlotHexBinsSVG />
      plotGrid = <PlotSquareGridSVG />
    }
    else if (this.props.plotShape == 'hex'){
      if (this.props.plotGraphics == 'canvas'){
        //plotContainer = <PlotHexBinsCanvas />
      }
      plotContainer = <PlotHexBinsSVG />
      plotGrid = <PlotHexGridSVG />
    }
    if (this.props.plotShape == 'circle'){
      return (
        <div className={styles.outer}>
          <svg ref={(elem) => { this.svg = elem; }}
            className={styles.main_plot+' '+styles.fill_parent}
            viewBox={viewbox}
            preserveAspectRatio="xMidYMid meet">
            <PlotTransformLines />
            {xPlot}
            {yPlot}
            <rect className={styles.plot_boundary} x={0} y={0} width={1000} height={1000}/>
            <PlotAxisTitle axis='x'/>
            <PlotAxisTitle axis='y'/>
          </svg>
          {plotContainer}
        </div>
      )
    }
    else {
      return (
        <div className={styles.outer}>
          <svg ref={(elem) => { this.svg = elem; }}
            className={styles.main_plot+' '+styles.fill_parent}
            viewBox={viewbox}
            preserveAspectRatio="xMidYMid meet">
            <PlotTransformLines />
            {plotContainer}
            {plotGrid}
            {xPlot}
            {yPlot}
            <Pointable
              tagName='g'
              onPointerMove={(e)=>{
                e.preventDefault()
                if (this.state.mouseDown){
                  let coords = relativeCoords(e)
                  let hex = this.getHexByPixel(coords.x,coords.y,this.props.radius)
                  if (!hexes[hex.id]){
                    hexes[hex.id] = true;
                  }
                  this.toggleSelection(hex.ids)
                }
              }}
              onPointerLeave={(e)=>{
                e.preventDefault()
                //e.target.releasePointerCapture(e.pointerId)
                this.setMouseDown(false)
              }}
              onPointerDown={(e)=>{
                e.preventDefault()
                let coords = relativeCoords(e)
                let hex = this.getHexByPixel(coords.x,coords.y,this.props.radius)
                console.log(hex)
                if (hex.ids.length > 0){
                  // TODO: update this to be a meaningful test
                  this.setAddRecords(true)
                  hexes[hex.id] = true;
                  this.props.addRecords(hex.ids)
                }
                this.setMouseDown(true)
              }}
              onPointerUp={(e)=>{
                e.preventDefault()
                this.setMouseDown(false)
              }}
              >
            <rect className={styles.plot_boundary} x={0} y={0} width={1000} height={1000}/>
            </Pointable>
            <PlotAxisTitle axis='x'/>
            <PlotAxisTitle axis='y'/>
          </svg>
        </div>

      )
    }
  }
}
