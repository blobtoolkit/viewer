import React from 'react'
import { connect } from 'react-redux'
import { getAxisTitle } from '../reducers/plotData'
import styles from './Plot.scss'
import { plotText } from './PlotStyles'

export const AxisTitle = ({ axis, title, side=1000 }) => {
  let params = {}
  params.transform = axis == 'x' ? 'translate(500,1085)' : 'translate(-85,500),rotate(90)'
  return (
    <g {...params}>
      <text style={plotText.axisTitle} transform={'scale('+side/1000+')'}>
        {title}
      </text>
    </g>
  )
};

export default AxisTitle
