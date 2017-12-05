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
      <ConnectedSideBins axis={this.props.axis}/>
    )
  }
}

const SideBinsSVG = ({ paths = [], axis='x' }) => {
  let params = {}
  params.transform = axis == 'x' ? 'translate(0,-300)' : 'translate(1300,0),rotate(90)'
  params.height = axis == 'x' ? 300 : 1000
  params.width = axis == 'x' ? 1000 : 300
  return (
    <g {...params}>
      {paths.map((path,i) =>
        <path className={styles.side_bins} d={path.path} key={i} color={path.color}  />
      )}
      <rect className={styles.plot_boundary} x={0} y={0} width={1000} height={300}/>
    </g>
  )
}
