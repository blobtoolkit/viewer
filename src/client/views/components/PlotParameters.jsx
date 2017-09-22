import React from 'react';
import { connect } from 'react-redux'
import styles from './Plot.scss'
import { getPlotShape, setPlotShape } from '../reducers/plotParameters'

export default class PlotParameters extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = () => {
      return (state, props) => {
        return {
          shape:getPlotShape(state)
        }
      }
    }
    this.mapDispatchToProps = dispatch => {
      return {
        onSelectShape: shape => dispatch(setPlotShape(shape))
      }
    }
  }

  render(){
    const ConnectedPlotParameters = connect(
      this.mapStateToProps,
      this.mapDispatchToProps
    )(Parameters)
    return (
      <ConnectedPlotParameters/>
    )
  }
}
const Parameters = ({ shape, onSelectShape }) => {
  return (
    <div>
    <span onClick={()=>onSelectShape('square')}>Squares</span>
    <span onClick={()=>onSelectShape('hex')}>Hexagons</span>
    </div>
  )
};
