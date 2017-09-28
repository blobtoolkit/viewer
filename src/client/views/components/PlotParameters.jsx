import React from 'react';
import { connect } from 'react-redux'
import styles from './Plot.scss'
import { getAxisTitle } from '../reducers/plotData'
import { getPlotShape,
  setPlotShape,
  getPlotResolution,
  setPlotResolution,
  getZReducer,
  setZReducer,
  getZScale,
  setZScale } from '../reducers/plotParameters'

export default class PlotParameters extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = () => {
      return (state, props) => {
        return {
          title:getAxisTitle(state,'z'),
          shape:getPlotShape(state),
          resolution:getPlotResolution(state),
          reducer:getZReducer(state),
          scale:getZScale(state)
        }
      }
    }
    this.mapDispatchToProps = dispatch => {
      return {
        onSelectShape: shape => dispatch(setPlotShape(shape)),
        onChangeResolution: value => dispatch(setPlotResolution(value)),
        onSelectReducer: reducer => dispatch(setZReducer(reducer)),
        onSelectScale: reducer => dispatch(setZScale(reducer))
      }
    }
  }

  render(){
    const ConnectedPlotParameters = connect(
      this.mapStateToProps,
      this.mapDispatchToProps
    )(Parameters)
    return (
      <ConnectedPlotParameters/>
    )
  }
}
const Parameters = ({ title, shape, onSelectShape, resolution, onChangeResolution, reducer, onSelectReducer, scale, onSelectScale }) => {
  return (
    <div className={styles.axis_title+' '+styles.top_axis_title}>
      <h2>{title}</h2>
      <span onClick={()=>onSelectShape('square')} className={shape == 'square' ? styles.active : ''}>square</span>
      <span onClick={()=>onSelectShape('hex')} className={shape == 'hex' ? styles.active : ''}>hex</span>
      <span onClick={()=>onSelectShape('circle')} className={shape == 'circle' ? styles.active : ''}>circle</span>
      <input onChange={(e)=>onChangeResolution(e.target.value)} type="range" value={resolution} min="5" max="50" step="1" className={styles.flip_horiz}/>
      <span onClick={()=>onSelectReducer('sum')} className={reducer.id == 'sum' ? styles.active : ''}>sum</span>
      <span onClick={()=>onSelectReducer('max')} className={reducer.id == 'max' ? styles.active : ''}>max</span>
      <span onClick={()=>onSelectReducer('min')} className={reducer.id == 'min' ? styles.active : ''}>min</span>
      <span onClick={()=>onSelectReducer('count')} className={reducer.id == 'count' ? styles.active : ''}>count</span>
      <span onClick={()=>onSelectReducer('mean')} className={reducer.id == 'mean' ? styles.active : ''}>mean</span>
      <span onClick={()=>onSelectScale('scaleLog')} className={scale == 'scaleLog' ? styles.active : ''}>log</span>
      <span onClick={()=>onSelectScale('scaleLinear')} className={scale == 'scaleLinear' ? styles.active : ''}>linear</span>
      <span onClick={()=>onSelectScale('scaleSqrt')} className={scale == 'scaleSqrt' ? styles.active : ''}>sqrt</span>
    </div>
  )
};
