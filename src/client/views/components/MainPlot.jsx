import React from 'react'
import { connect } from 'react-redux'
import { getPlotShape } from '../reducers/plotParameters'
import { getPlotGraphics } from '../reducers/plotData'
import styles from './Plot.scss'
import MainPlotBoundary from './MainPlotBoundary'
import PlotBubblesCanvasLayers from './PlotBubblesCanvasLayers'
import PlotBubblesSVGLayers from './PlotBubblesSVGLayers'
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
import { getScatterPlotDataByHexBin,
  getSelectedHexGrid } from '../reducers/plotHexBins'
import { getSquareGrid,
  setCoords,
  getScatterPlotDataBySquareBin,
  getSelectedSquareGrid } from '../reducers/plotSquareBins'
import { pixel_to_oddr } from '../reducers/hexFunctions'
import { addRecords, removeRecords } from '../reducers/select'
import * as d3 from 'd3'
import { renderToStaticMarkup } from 'react-dom/server';
const saveSvgAsPng = require('save-svg-as-png/saveSvgAsPng.js')

export default class MainPlot extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = () => {
      return (state, props) => {
        let plotShape = getPlotShape(state)
        let plotGraphics = getPlotGraphics(state)
        if (plotShape == 'hex'){
          return {
            plotShape,
            plotGraphics,
            bins: getScatterPlotDataByHexBin(state).hexes,
            radius: getScatterPlotDataByHexBin(state).radius,
            data: getSelectedHexGrid(state).data
          }
        }
        else if (plotShape == 'square') {
          return {
            plotShape,
            plotGraphics,
            bins: getScatterPlotDataBySquareBin(state).squares,
            data: getSelectedSquareGrid(state).data,
            grid: getScatterPlotDataBySquareBin(state).grid
          }
        }
        return {
          plotShape,
          plotGraphics
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
  return {x,y}
}

class PlotBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {mouseDown:false,addRecords:true,bins:{}}
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
    let hex
    if (this.props.bins[oddr.i] && this.props.bins[oddr.i][oddr.j]){
      hex = this.props.bins[oddr.i][oddr.j]
    }
    else {
      hex = {id:null,ids:[]}
    }
    return hex
  }

  getBinByPixel(xy,grid){
    let bin
    let coords = setCoords(xy,grid)
    if (this.props.bins[coords[0]] && this.props.bins[coords[0]][coords[1]]){
      bin = this.props.bins[coords[0]][coords[1]]
    }
    else {
      bin = {id:null,ids:[]}
    }
    return bin
  }


  shouldComponentUpdate(nextProps, nextState){
    if (this.props.plotShape != nextProps.plotShape){
      return true
    }
    else if (this.props.plotGraphics != nextProps.plotGraphics){
      return true
    }
    return false
  }

  render(){
    let plotContainer
    let plotGrid
    let plotCanvas
    let bins = this.state.bins
    let viewbox = '0 0 1420 1420'
    let xPlot = <PlotSideBinsSVG axis='x'/>
    let yPlot = <PlotSideBinsSVG axis='y'/>
    if (this.props.plotShape == 'circle'){
      if (this.props.plotGraphics == 'canvas'){
        plotCanvas = <PlotBubblesCanvasLayers />
        plotContainer = ''
      }
      else {
        plotContainer = <PlotBubblesSVGLayers />
      }
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
          <svg id="main_plot"
            ref={(elem) => { this.svg = elem; }}
            className={styles.main_plot+' '+styles.fill_parent}
            viewBox={viewbox}
            preserveAspectRatio="xMidYMid meet">
            <g transform={'translate(100,320)'} >
              <PlotTransformLines />
              <g transform="translate(50,50)">
              {plotContainer}
              </g>
              {xPlot}
              {yPlot}
              <MainPlotBoundary/>
              <PlotAxisTitle axis='x'/>
              <PlotAxisTitle axis='y'/>
            </g>
          </svg>
          {plotCanvas}
          <a className={styles.save_svg} onClick={()=>(saveSvgAsPng.saveSvg(document.getElementById("main_plot"),"main_plot.svg"))}>save image</a>
        </div>
      )
    }
    else {
      return (
        <div className={styles.outer}>
          <svg id="main_plot"
            ref={(elem) => { this.svg = elem; }}
            className={styles.main_plot+' '+styles.fill_parent}
            viewBox={viewbox}
            preserveAspectRatio="xMidYMid meet">
            <g transform={'translate(100,320)'} >
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
                    if (Math.floor(coords.x) % 2 == 0){
                      let bin
                      if (this.props.plotShape == 'hex'){
                        bin = this.getHexByPixel(coords.x,coords.y,this.props.radius)
                      }
                      else {
                        bin = this.getBinByPixel(coords,this.props.grid)
                      }
                      if (!bins[bin.id] && this.state.addRecords){
                        bins[bin.id] = true;
                        this.setState({bins})
                        this.toggleSelection(bin.ids)
                      }
                      else if (!this.state.addRecords) {
                        delete bins[bin.id];
                        this.setState({bins})
                        this.toggleSelection(bin.ids)
                      }
                    }
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
                  let bin
                  if (this.props.plotShape == 'hex'){
                    bin = this.getHexByPixel(coords.x,coords.y,this.props.radius)
                  }
                  else {
                    bin = this.getBinByPixel(coords,this.props.grid)
                  }
                  let index = this.props.data.findIndex(d => d.id == bin.id)
                  if (this.props.data[index] && this.props.data[index].selected == 0){
                    this.setAddRecords(true)
                    bins[bin.id] = true;
                    this.setState({bins})
                    this.props.addRecords(bin.ids)
                  }
                  else {
                    this.setAddRecords(false)
                    if (bins[bin.id]){
                      delete bins[bin.id]
                    }
                    this.setState({bins})
                    this.props.removeRecords(bin.ids)
                  }
                  this.setMouseDown(true)
                }}
                onPointerUp={(e)=>{
                  e.preventDefault()
                  this.setMouseDown(false)
                }}
                >
                <MainPlotBoundary/>
              </Pointable>
              <PlotAxisTitle axis='x'/>
              <PlotAxisTitle axis='y'/>
            </g>
          </svg>
          <a className={styles.save_svg} onClick={()=>(saveSvgAsPng.saveSvg(document.getElementById("main_plot"),"main_plot.svg"))}>save image</a>
        </div>

      )
    }
  }
}
