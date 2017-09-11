import React from 'react'
import { connect } from 'react-redux'
import { getScatterPlotDataByCategory } from '../reducers/plotData'
import { getColorPalette } from '../reducers/color'
import MainPlotBox from './MainPlotBox'

class MainPlot extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = () => {
      return (state, props) => {
        let data = getScatterPlotDataByCategory(state, props.filterId)
        data.colors = getColorPalette(state).colors
        return data
      }
    }
    this.mapDispatchToProps = dispatch => {
      return {
      }
    }
  }

  render(){
    const ConnectedMainPlot = connect(
      this.mapStateToProps,
      this.mapDispatchToProps
    )(MainPlotBox)
    return (
      <ConnectedMainPlot {...this.props}/>
    )
  }
}

export default MainPlot
