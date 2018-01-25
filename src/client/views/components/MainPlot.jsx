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

export default class MainPlot extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = () => {
      return (state, props) => ({
        plotShape:getPlotShape(state),
        plotGraphics:getPlotGraphics(state)
      })
    }
  }

  render(){
    const ConnectedMainPlot = connect(
      this.mapStateToProps
    )(PlotBox)
    return (
      <ConnectedMainPlot />
    )
  }
}

class PlotBox extends React.Component {
  render(){
    let plotContainer
    let plotGrid
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
                console.log(e.layerX + ' ' + e.layerY)
                if (1){//mouseDown){
                //  onClickCell(datum.ids)
                }
              }}
              onPointerLeave={(e)=>{
                e.preventDefault()
                //e.target.releasePointerCapture(e.pointerId)
                console.log(e)
                console.log('left')
              }}
              onPointerEnter={(e)=>{
                e.preventDefault()
                //e.target.releasePointerCapture(e.pointerId)
                console.log('entered')
              }}
              onPointerDown={(e)=>{
                e.preventDefault()
                //e.target.setPointerCapture(e.pointerId)
                if(1){//if (datum.selected){
                //  setAddRecords(false)
                }
                else {
                //  setAddRecords(true)
                }
                //setMouseDown(true)
              }}
              onPointerUp={(e)=>{
                e.preventDefault()
                //setMouseDown(false)
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
