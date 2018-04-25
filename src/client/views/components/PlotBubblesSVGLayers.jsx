import React from 'react';
import { connect } from 'react-redux'
import PlotBubblesSVG from './PlotBubblesSVG'
import { getCategoryListForMainPlot }  from '../reducers/plotData'

export default class PlotBubblesSVGLayers extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = () => {
      return (state, props) => (
        getCategoryListForMainPlot(state)
      )
    }
  }

  render(){
    const ConnectedBubbleSVGLayers = connect(
      this.mapStateToProps
    )(BubblesSVGLayers)
    return (
      <ConnectedBubbleSVGLayers />
    )
  }
}

const BubblesSVGLayers = ({ bins }) => (
    <g>
      {bins.map((layer,i) =>
        <PlotBubblesSVG key={layer.id} x0={layer.x0} />
      )}
    </g>
);
