import React from 'react'
import { connect } from 'react-redux'
import { getPlotShape,getPlotGraphics, getCircleLimit } from '../reducers/plotParameters'
import { getStaticThreshold, getNohitThreshold } from '../reducers/repository'
import styles from './Plot.scss'
import MainPlotBoundary from './MainPlotBoundary'
import PlotBubblesCanvasLayers from './PlotBubblesCanvasLayers'
import PlotBubblesSVGLayers from './PlotBubblesSVGLayers'
//import PlotSquareBinsCanvas from './PlotSquareBinsCanvas'
import PlotSquareBinsSVG from './PlotSquareBinsSVG'
import PlotSquareGridSVG from './PlotSquareGridSVG'
//import PlotHexBinsCanvas from './PlotHexBinsCanvas'
import PlotKitesSVG from './PlotKitesSVG'
import PlotRefKitesSVG from './PlotRefKitesSVG'
import PlotHexBinsSVG from './PlotHexBinsSVG'
import PlotHexGridSVG from './PlotHexGridSVG'
import PlotAxisTitle from './PlotAxisTitle'
import PlotParameters from './PlotParameters'
import PlotTransformLines from './PlotTransformLines'
import PlotSideBinsSVG from './PlotSideBinsSVG'
import PlotLegend from './PlotLegend'
import FigureCaption from './FigureCaption'
import Pointable from 'react-pointable';
import { getKitePlotData, getScatterPlotData } from '../reducers/plotData'
import { getScatterPlotDataByHexBin,
  getSelectedHexGrid,
  getHexGridScale } from '../reducers/plotHexBins'
import { getSquareGrid,
  setCoords,
  getScatterPlotDataBySquareBin,
  getSelectedSquareGrid,
  getSquareGridScale } from '../reducers/plotSquareBins'
import { pixel_to_oddr } from '../reducers/hexFunctions'
import { addRecords, removeRecords, setSelectSource } from '../reducers/select'
import { scaleLinear as d3scaleLinear } from 'd3-scale';
import { renderToStaticMarkup } from 'react-dom/server';
import { ExportButton } from './ExportButton'
import { NoBlobWarning } from './NoBlobWarning'
import { NoHitWarning } from './NoHitWarning'
import LassoSelect from './LassoSelect'
import { getDatasetID } from '../reducers/location'
import { getRecordCount } from '../reducers/summary'

export default class MainPlot extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = () => {
      return (state, props) => {
        if (!getScatterPlotDataBySquareBin(state)) return {}
        let plotShape = getPlotShape(state)
        if (plotShape == 'hex'){
          if (!getScatterPlotDataByHexBin(state)) return {}
          return {
            datasetId: getDatasetID(state),
            plotShape: getPlotShape(state),
            plotGraphics: getPlotGraphics(state),
            binned: getScatterPlotDataByHexBin(state),
            data: getSelectedHexGrid(state).data,
            records: getRecordCount(state),
            staticThreshold: getStaticThreshold(state),
            nohitThreshold: getNohitThreshold(state),
            zScale: getHexGridScale(state)
          }
        }
        else if (plotShape == 'square') {
          return {
            datasetId: getDatasetID(state),
            plotShape: getPlotShape(state),
            plotGraphics: getPlotGraphics(state),
            binned: getScatterPlotDataBySquareBin(state),
            data: getSelectedSquareGrid(state).data,
            records: getRecordCount(state),
            staticThreshold: getStaticThreshold(state),
            nohitThreshold: getNohitThreshold(state),
            zScale: getSquareGridScale(state)
          }
        }
        else if (plotShape == 'kite') {
          return {
            datasetId: getDatasetID(state),
            plotShape: getPlotShape(state),
            plotGraphics: getPlotGraphics(state),
            binned: getKitePlotData(state),
            records: getRecordCount(state),
            staticThreshold: getStaticThreshold(state),
            nohitThreshold: getNohitThreshold(state)
          }
        }
        return {
          datasetId: getDatasetID(state),
          plotShape: getPlotShape(state),
          plotGraphics: getPlotGraphics(state),
          records: getRecordCount(state),
          circleLimit: getCircleLimit(state),
          staticThreshold: getStaticThreshold(state),
          nohitThreshold: getNohitThreshold(state),
          range: getScatterPlotData(state).range
        }
      }
    }
    this.mapDispatchToProps = dispatch => {
      return {
        addRecords:(arr) => {
          dispatch(setSelectSource('blob'))
          dispatch(addRecords(arr))
        },
        removeRecords:(arr) => {
          dispatch(setSelectSource('blob'))
          dispatch(removeRecords(arr))
        }
      }
    }
  }

  render(){
    const ConnectedMainPlot = connect(
      this.mapStateToProps,
      this.mapDispatchToProps
    )(PlotBox)
    return (
      <ConnectedMainPlot {...this.props}/>
    )
  }
}

const xScale = d3scaleLinear().range([-55.556,955.556])
const yScale = d3scaleLinear().range([-55.556,955.556])

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
    if (this.props.binned.hexes[oddr.i] && this.props.binned.hexes[oddr.i][oddr.j]){
      hex = this.props.binned.hexes[oddr.i][oddr.j]
    }
    else {
      hex = {id:null,ids:[]}
    }
    return hex
  }

  getBinByPixel(xy,grid){
    let bin
    let coords = setCoords(xy,grid)
    if (this.props.binned.squares[coords[0]] && this.props.binned.squares[coords[0]][coords[1]]){
      bin = this.props.binned.squares[coords[0]][coords[1]]
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
    else if (this.props.circleLimit != nextProps.circleLimit){
      return true
    }
    else if (this.props.binned && this.props.binned.data && this.props.binned.data.length == 0){
      return true
    }
    return false
  }

  render(){
    if (this.props.active && this.props.active != 'loading' && Object.keys(this.props.plot.axes).length < 4){
      return <NoBlobWarning/>
    }
    else if (!this.props.plotShape){
      return null
    }
    let plotContainer
    let plotGrid
    let plotCanvas
    let mask = (
      <defs>
        <clipPath id="plot-area">
          <rect x="0" y="0" width="900" height="900" />
        </clipPath>
      </defs>
    )
    let func = undefined
    if (this.props.plotShape == 'circle'){
      if (this.props.plotGraphics != 'svg'){
        func = ()=>alert('Circles are rendered as canvas to improve performance. Set plot graphics to svg in order to export this plot as svg or png.')
      }
    }
    let side = 1420
    let exportButtons = (
      <span className={styles.download}>
        <ExportButton view='blob' element='main_plot' prefix={this.props.datasetId+'.blob.'+this.props.plotShape} format='svg' func={func}/>
        <ExportButton view='blob' element='main_plot' prefix={this.props.datasetId+'.blob.'+this.props.plotShape} format='png' func={func} size={side}/>
      </span>
    )
    let bins = this.state.bins
    let viewbox = '0 0 '+side+' '+side
    let xPlot, yPlot
    // if (this.props.plotShape != 'kite'){
      xPlot = <PlotSideBinsSVG axis='x'/>
      yPlot = <PlotSideBinsSVG axis='y'/>
    // }
    let legend = <g transform='translate(1010,-290)'><PlotLegend/></g>
    if (this.props.plotShape == 'circle'){
      if (this.props.plotGraphics != 'svg'){
        plotContainer = ''
      }
      else {
        plotContainer = <PlotBubblesSVGLayers {...this.props}/>
      }
    }
    else if (this.props.plotShape == 'kite'){
      plotContainer = <PlotKitesSVG />
    }
    else if (this.props.plotShape == 'square'){
      plotContainer = <PlotSquareBinsSVG />
      plotGrid = <PlotSquareGridSVG />
    }
    else if (this.props.plotShape == 'hex'){
      plotContainer = <PlotHexBinsSVG />
      plotGrid = <PlotHexGridSVG />
    }
    if (this.props.plotShape == 'circle'){
      if (this.props.plotGraphics != 'svg'){
        plotCanvas = (

          <svg id="main_plot"
            ref={(elem) => { this.svg = elem; }}
            className={styles.main_plot+' '+styles.fill_parent}
            viewBox={viewbox}
            preserveAspectRatio="xMinYMin">
            {mask}
            <g transform={'translate(100,320)'} >
              <g transform="translate(50,50)">
                <g>
                  <foreignObject width={900} height={900}>
                    <div xmlns="http://www.w3.org/1999/xhtml" className={styles.fill_parent}>
                      <PlotBubblesCanvasLayers {...this.props}/>
                    </div>
                  </foreignObject>
                  <PlotRefKitesSVG/>
                </g>
              </g>
            </g>
          </svg>
        )
      }
      return (
        <div className={styles.outer}>
          <div className={styles.fill_parent} style={{display:'block',position:'relative'}}>
            <div style={{height:'100%',width:'100%',position:'absolute'}}>
              {plotCanvas}
            </div>
            <div style={{height:'100%',width:'100%',position:'absolute'}}>
              <svg id="main_plot"
                ref={(elem) => { this.svg = elem; }}
                className={styles.main_plot+' '+styles.fill_parent}
                viewBox={viewbox}
                preserveAspectRatio="xMinYMin">
                {mask}
                <g transform={'translate(100,320)'} >
                  <g transform="translate(50,50)">
                    <PlotTransformLines />
                    {plotContainer}
                    <PlotRefKitesSVG/>
                  </g>
                  {xPlot}
                  {yPlot}
                  {legend}
                  <LassoSelect/>
                  <PlotAxisTitle axis='x' side={side}/>
                  <PlotAxisTitle axis='y' side={side}/>
                </g>
              </svg>
              {exportButtons}
            </div>
          </div>
          <FigureCaption {...this.props}/>
          { this.props.records > this.props.circleLimit && this.props.staticThreshold > this.props.records && <NoHitWarning circleLimit={this.props.circleLimit}/> }
        </div>
      )
    }
    else if (this.props.plotShape == 'kite'){
      return (
        <div className={styles.outer}>
          <div className={styles.fill_parent}>
            <svg id="main_plot"
              ref={(elem) => { this.svg = elem; }}
              className={styles.main_plot+' '+styles.fill_parent}
              viewBox={viewbox}
              preserveAspectRatio="xMinYMin">
              {mask}
              <g transform={'translate(100,320)'} >
                <g transform="translate(50,50)">
                  <PlotTransformLines />
                  {plotContainer}
                  <PlotRefKitesSVG/>
                </g>
                {xPlot}
                {yPlot}
                {legend}
                <LassoSelect/>
                <PlotAxisTitle axis='x' side={side}/>
                <PlotAxisTitle axis='y' side={side}/>
              </g>
            </svg>
            {exportButtons}
          </div>
          <FigureCaption {...this.props}/>
        </div>
      )
    }
    else {
      return (
        <div className={styles.outer}>
          <div className={styles.fill_parent}>
            <svg id="main_plot"
              ref={(elem) => { this.svg = elem; }}
              className={styles.main_plot+' '+styles.fill_parent}
              viewBox={viewbox}
              style={{fontSize:'14px'}}
              preserveAspectRatio="xMinYMin">
              {mask}
              <g transform={'translate(100,320)'} >
                <g transform="translate(50,50)">
                  <PlotTransformLines />
                </g>
                {plotContainer}
                <g transform="translate(50,50)">
                  <PlotRefKitesSVG/>
                </g>
                {plotGrid}
                {xPlot}
                {yPlot}
                {legend}
                <Pointable
                  tagName='g'
                  onPointerMove={(e)=>{
                    e.preventDefault()
                    if (this.state.mouseDown){
                      let coords = relativeCoords(e)
                      if (Math.floor(coords.x) % 2 == 0){
                        let bin
                        if (this.props.plotShape == 'hex'){
                          bin = this.getHexByPixel(coords.x,coords.y,this.props.binned.radius)
                        }
                        else {
                          bin = this.getBinByPixel(coords,this.props.binned.grid)
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
                      bin = this.getHexByPixel(coords.x,coords.y,this.props.binned.radius)
                    }
                    else {
                      bin = this.getBinByPixel(coords,this.props.binned.grid)
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
                <PlotAxisTitle axis='x' side={side}/>
                <PlotAxisTitle axis='y' side={side}/>
              </g>
            </svg>
            {exportButtons}
          </div>
          <FigureCaption {...this.props}/>
        </div>

      )
    }
  }
}
