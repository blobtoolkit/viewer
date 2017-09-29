import React from 'react';
import { connect } from 'react-redux'
import { getBinnedLinesByCategoryForAxis }  from '../reducers/plotSquareBins'
import styles from './Plot.scss'

export default class PlotSideBinsSVG extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = () => {
      return (state, props) => (
        getBinnedLinesByCategoryForAxis(state,this.props.axis)
      )
    }
  }

  render(){
    const ConnectedSideBins = connect(
      this.mapStateToProps
    )(SideBinsSVG)
    return (
      <ConnectedSideBins />
    )
  }
}

const SideBinsSVG = ({ paths = [] }) => {
  console.log(paths)
  return (
    <g>
      {paths.map((path,i) =>
        <path className={styles.side_bins} d={path.path} key={i} color={path.color}  />
      )}
    </g>
  )
}
