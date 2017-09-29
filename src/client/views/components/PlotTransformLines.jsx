import React from 'react';
import { connect } from 'react-redux'
import { getTransformLines }  from '../reducers/plotOverlay'
import styles from './Plot.scss'

export default class PlotTransformLines extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = () => {
      return (state, props) => (
        getTransformLines(state)
      )
    }
  }

  render(){
    const ConnectedTransformLines = connect(
      this.mapStateToProps
    )(TransformLines)
    return (
      <ConnectedTransformLines />
    )
  }
}

const TransformLines = ({ lines = [], params}) => {
  if (params.factor != 0){
    return (
      <g>
        {lines.map((line,i) =>
          <path d={line} key={i} className={styles.transform_line} />
        )}
      </g>
    )
  }
  return null
}
