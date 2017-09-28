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
          {plotContainer}
          <PlotParameters axis='top'/>
          <PlotAxisTitle axis='x'/>
          <PlotAxisTitle axis='y'/>
        </div>
      )
    }
    else {
      return (
        <div className={styles.outer}>
          <svg ref={(elem) => { this.svg = elem; }}
            className={styles.main_plot}
            viewBox='0 0 1000 1000'>
            {plotContainer}
            {plotGrid}
          </svg>
          <PlotParameters axis='top'/>
          <PlotAxisTitle axis='x'/>
          <PlotAxisTitle axis='y'/>
        </div>

      )
    }
  }
}
