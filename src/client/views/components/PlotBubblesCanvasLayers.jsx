import React from 'react';
import { connect } from 'react-redux'
import PlotBubblesCanvas from './PlotBubblesCanvas'
import { getCategoryListForMainPlot }  from '../reducers/plotData'

export default class PlotBubblesCanvasLayers extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = () => {
      return (state, props) => (
        getCategoryListForMainPlot(state)
      )
    }
  }

  render(){
    const ConnectedBubbleCanvasLayers = connect(
      this.mapStateToProps
    )(BubblesCanvasLayers)
    return (
      <ConnectedBubbleCanvasLayers />
    )
  }
}

const BubblesCanvasLayers = ({ bins }) => (
    <div>
      {bins.map((layer,i) =>
        <PlotBubblesCanvas key={layer.id} x0={layer.x0} />
      )}
    </div>
);