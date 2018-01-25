import React from 'react';
import { connect } from 'react-redux'
import PlotHexBinSVG from './PlotHexBinSVG'
import { getScatterPlotDataByHexBinByCategory }  from '../reducers/plotHexBins'
import styles from './Plot.scss'

export default class PlotHexBinsSVG extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = () => {
      return (state, props) => (
        //console.log(getScatterPlotDataByHexBin(state))
        getScatterPlotDataByHexBinByCategory(state)
        // plotGraphics:getPlotGraphics(state)
      )
    }
  }

  render(){
    const ConnectedHexBins = connect(
      this.mapStateToProps
    )(HexBinsSVG)
    return (
      <ConnectedHexBins />
    )
  }
}

const HexBinsSVG = ({ data = [], css = '' }) => (
    <g className={styles.padded_main}>
      {data.map(hex =>
        <PlotHexBinSVG key={hex.id} {...hex} css={css} />
      )}
    </g>
);
