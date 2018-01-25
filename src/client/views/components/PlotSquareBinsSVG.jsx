import React from 'react';
import { connect } from 'react-redux'
import PlotSquareBinSVG from './PlotSquareBinSVG'
import { getScatterPlotDataBySquareBinByCategory }  from '../reducers/plotSquareBins'
import styles from './Plot.scss'

export default class PlotSquareBinsSVG extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = () => {
      return (state, props) => (
        //console.log(getScatterPlotDataByHexBin(state))
        getScatterPlotDataBySquareBinByCategory(state)
        // plotGraphics:getPlotGraphics(state)
      )
    }
  }

  render(){
    const ConnectedSquareBins = connect(
      this.mapStateToProps
    )(SquareBinsSVG)
    return (
      <ConnectedSquareBins />
    )
  }
}

const SquareBinsSVG = ({ data = [], css = '' }) => {
  let squares = []
  data.forEach((datum,i)=>{
    let color = datum.color || '#999'
    squares.push(<rect key={i} className={styles.square} color={color} x={datum.x} y={datum.y} height={datum.height} width={datum.width} />)
  })
  return (
    <g className={styles.padded_main}>
    {squares}
    </g>
  )
}
