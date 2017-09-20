import React from 'react'
import { connect } from 'react-redux'
import { getPlotShape, getPlotGraphics } from '../reducers/plotParameters'
import styles from './Plot.scss'
import MainPlotBox from './MainPlotBox'
import PlotBubblesCanvas from './PlotBubblesCanvas'
import PlotBubblesSVG from './PlotBubblesSVG'
//import PlotSquareBinsCanvas from './PlotSquareBinsCanvas'
import PlotSquareBinsSVG from './PlotSquareBinsSVG'
//import PlotHexBinsCanvas from './PlotHexBinsCanvas'
import PlotHexBinsSVG from './PlotHexBinsSVG'
import PlotHexGridSVG from './PlotHexGridSVG'

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
    if (this.props.plotShape == 'circle'){
      if (this.props.plotGraphics == 'canvas'){
        plotContainer = <PlotBubblesCanvas />
      }
      plotContainer = <PlotBubblesSVG />
    }
    else if (this.props.plotShape == 'square'){
      if (this.props.plotGraphics == 'canvas'){
        //plotContainer = <PlotSquareBinsCanvas />
      }
      plotContainer = <PlotSquareBinsSVG />
    }
    else if (this.props.plotShape == 'hex'){
      if (this.props.plotGraphics == 'canvas'){
        //plotContainer = <PlotHexBinsCanvas />
      }
      plotContainer = <PlotHexBinsSVG />
    }
    if (this.props.plotGraphics == 'canvas'){
      return (
        <div className={styles.outer}>
          {plotContainer}
        </div>
      )
    }
    else {
      return (
        <div className={styles.outer}>
          <svg ref={(elem) => { this.svg = elem; }}
            className={styles.main_plot}
            viewBox='0 0 1000 1000'>
            <PlotHexGridSVG />
            {plotContainer}
          </svg>
        </div>
      )
    }
  }
}
