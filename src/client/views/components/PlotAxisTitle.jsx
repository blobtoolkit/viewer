import React from 'react'
import { connect } from 'react-redux'
import { getAxisTitle } from '../reducers/plotData'
import styles from './Plot.scss'

export default class PlotAxisTitle extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = () => {
      return (state, props) => ({
        title:getAxisTitle(state,props.axis)
      })
    }
  }

  render(){
    const ConnectedAxisTitle = connect(
      this.mapStateToProps
    )(AxisTitle)
    return (
      <ConnectedAxisTitle {...this.props} />
    )
  }
}

const AxisTitle = ({ axis, title }) => {
  let params = {}
  params.transform = axis == 'x' ? 'translate(500,1075)' : 'translate(-75,500),rotate(90)'
  return (
    <g {...params}>
      <text className={styles.axis_title}>{title}</text>
    </g>
  )
};
