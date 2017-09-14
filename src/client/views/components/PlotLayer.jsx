import React from 'react'
import { connect } from 'react-redux'
import { getCategoryListForMainPlot,
  getScatterPlotDataForCategoryIndex } from '../reducers/plotData'
import PlotBubblesCanvas from './PlotBubblesCanvas'
import styles from './Plot.scss'

class PlotLayer extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = () => {
      return (state, props) => {
        return getScatterPlotDataForCategoryIndex(state,props.index)
      }
    }
    this.mapDispatchToProps = dispatch => {
      return {
      }
    }
  }

  render(){
    const ConnectedPlotLayer = connect(
      this.mapStateToProps,
      this.mapDispatchToProps
    )(CurrentLayer)
    return (
      <ConnectedPlotLayer {...this.props}/>
    )
  }
}

// const CurrentLayer = ({ data, bins, color }) => (
//   <a>{bins.id}</a>
// );

class CurrentLayer extends React.Component {
  render(){
    let layer
      console.log(this.props)
    if (this.props.type == 'bubblesCanvas'){
      return (
        <div className={styles.fill_parent} style={{zIndex:this.props.zIndex}}>

        <PlotBubblesCanvas index={this.props.index} bubbles={this.props.data || []} color={this.props.color} />
</div>
      )
    }
  }
}

export default PlotLayer
