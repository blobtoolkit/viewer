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
  return (
    <div className={styles.axis_title+' '+styles[axis+'_axis_title']}>
    <h2>{title}</h2>
    </div>
  )
};
