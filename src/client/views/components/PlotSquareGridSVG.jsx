import React from 'react';
import { connect } from 'react-redux'
import styles from './Plot.scss'
import { getOccupiedSquareGrid } from '../reducers/plotSquareBins'

export default class PlotSquareGridSVG extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = () => {
      return (state, props) => {
        return getOccupiedSquareGrid(state)
      }
    }
    this.mapDispatchToProps = dispatch => {
      return {
      }
    }
  }

  render(){
    const ConnectedHexGrid = connect(
      this.mapStateToProps,
      this.mapDispatchToProps
    )(SquareGridSVG)
    return (
      <ConnectedHexGrid {...this.props}/>
    )
  }
}
const SquareGridSVG = ({ data }) => {
  let squares = []
  data.forEach((datum,i)=>{
    squares.push(<rect key={i} className={styles.square} x={datum.x} y={datum.y} height={datum.height} width={datum.width} />)
  })
  return (
    <g className={styles.grid}>
    {squares}
    </g>
  )
};
