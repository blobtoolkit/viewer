import React from 'react'
import { connect } from 'react-redux'
import { getCategoryListForMainPlot } from '../reducers/plotData'
import { getPlotType, getPlotResolution } from '../reducers/plotParameters'
import { getPlainCategoryListForFieldId } from '../reducers/preview'
import MainPlotBox from './MainPlotBox'

class MainPlot extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = () => {
      return (state, props) => {
        console.log(getPlotType(state))
        console.log(getPlotResolution(state))
        return getCategoryListForMainPlot(state)
        //return getPlainCategoryListForFieldId(state,'bestsum_superkingdom')
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
