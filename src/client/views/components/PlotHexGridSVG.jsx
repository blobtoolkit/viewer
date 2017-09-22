import React from 'react';
import { connect } from 'react-redux'
import styles from './Plot.scss'
import { getOccupiedHexGrid } from '../reducers/plotHexBins'

export default class PlotHexGridSVG extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = () => {
      return (state, props) => {
        return getOccupiedHexGrid(state)
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
    )(HexGridSVG)
    return (
      <ConnectedHexGrid {...this.props}/>
    )
  }
}
const HexGridSVG = ({ data }) => {
  let hexes = []
  data.forEach((datum,i)=>{
    hexes.push(<polygon key={i} className={styles.hex} points={datum.points} style={{fill:datum.color}}/>)
  })
  return (
    <g className={styles.grid}>
    {hexes}
    </g>
  )
};
