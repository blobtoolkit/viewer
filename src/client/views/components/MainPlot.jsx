import React from 'react'
import { connect } from 'react-redux'
import { getMainPlotData } from '../reducers/plotData'
import MainPlotBox from './MainPlotBox'

class MainPlot extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = () => {
      return (state, props) => {
        return getMainPlotData(state, props.filterId)
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
