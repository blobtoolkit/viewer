import React from 'react';
import { connect } from 'react-redux'
//import styles from './Plot.scss'
import { getAxisTitle } from '../reducers/plotData'
import { getPlotShape,
  choosePlotShape,
  getPlotResolution,
  setPlotResolution,
  choosePlotResolution,
  getZReducer,
  chooseZReducer,
  getZScale,
  chooseZScale,
  getTransformFunctionParams,
  setTransformFunction,
  getCurveOrigin,
  chooseCurveOrigin } from '../reducers/plotParameters'
import { chooseView } from '../reducers/repository'
import styles from './Layout.scss'
import MenuDisplaySimple from './MenuDisplaySimple'
import SVGIcon from './SVGIcon'
import TextIcon from './TextIcon'
import squareIcon from './svg/squareShape.svg';
import hexIcon from './svg/hexShape.svg';
import circleIcon from './svg/circleShape.svg';
import sumIcon from './svg/sum.svg';
import maxIcon from './svg/max.svg';
import minIcon from './svg/min.svg';
import countIcon from './svg/count.svg';
import meanIcon from './svg/mean.svg';
import logIcon from './svg/log.svg';
import linearIcon from './svg/linear.svg';
import sqrtIcon from './svg/sqrt.svg';
import xIcon from './svg/xLetter.svg';
import yIcon from './svg/yLetter.svg';
import zeroIcon from './svg/zero.svg';
import Palettes from './Palettes'
import MenuItem from './MenuItem'
import ToolTips from './ToolTips'
import Timeout from './Timeout'

const DisplayMenu = ({
  title, view,
  shape, onSelectShape,
  resolution, onChangeResolution,
  reducer, onSelectReducer,
  scale, onSelectScale,
  curveOrigin, onSelectCurveOrigin,
  transform, onChangeTransform,
  onSelectView }) => {
  return (
    <div className={styles.menu}>
      <MenuItem name='palette' type='palette'/>
      <MenuDisplaySimple name='shape'>
        <SVGIcon sprite={squareIcon} active={shape == 'square'} onIconClick={()=>onSelectShape('square')}/>
        <SVGIcon sprite={hexIcon} active={shape == 'hex'} onIconClick={()=>onSelectShape('hex')}/>
        <SVGIcon sprite={circleIcon} active={shape == 'circle'} onIconClick={()=>onSelectShape('circle')}/>
      </MenuDisplaySimple>
      <MenuDisplaySimple name='size'>
        <input onChange={(e)=>onChangeResolution(e.target.value)}
          type="range"
          value={resolution}
          min="5"
          max="50"
          step="1"
          className={styles.flip_horiz+' '+styles.full_height}
          data-tip data-for='size-slider'
          />
      </MenuDisplaySimple>
      <MenuDisplaySimple name='reducer function'>
        <SVGIcon sprite={sumIcon} active={reducer.id == 'sum'} onIconClick={()=>onSelectReducer('sum')}/>
        <SVGIcon sprite={maxIcon} active={reducer.id == 'max'} onIconClick={()=>onSelectReducer('max')}/>
        <SVGIcon sprite={minIcon} active={reducer.id == 'min'} onIconClick={()=>onSelectReducer('min')}/>
        <SVGIcon sprite={countIcon} active={reducer.id == 'count'} onIconClick={()=>onSelectReducer('count')}/>
        <SVGIcon sprite={meanIcon} active={reducer.id == 'mean'} onIconClick={()=>onSelectReducer('mean')}/>
      </MenuDisplaySimple>
      <MenuDisplaySimple name='scale function'>
        <SVGIcon sprite={logIcon} active={scale == 'scaleLog'} onIconClick={()=>onSelectScale('scaleLog')}/>
        <SVGIcon sprite={linearIcon} active={scale == 'scaleLinear'} onIconClick={()=>onSelectScale('scaleLinear')}/>
        <SVGIcon sprite={sqrtIcon} active={scale == 'scaleSqrt'} onIconClick={()=>onSelectScale('scaleSqrt')}/>
      </MenuDisplaySimple>
      <MenuDisplaySimple name='view'>
        <TextIcon title='blobplot' active={view == 'blob'} onIconClick={()=>onSelectView('blob')}/>
        <TextIcon title='cumulative' active={view == 'cumulative'} onIconClick={()=>onSelectView('cumulative')}/>
        <TextIcon title='snail' active={view == 'snail'} onIconClick={()=>onSelectView('snail')}/>
        <TextIcon title='table' active={view == 'table'} onIconClick={()=>onSelectView('table')}/>
      </MenuDisplaySimple>
      <MenuDisplaySimple name='curve origin'>
        <SVGIcon sprite={zeroIcon} active={curveOrigin == '0'} onIconClick={()=>onSelectCurveOrigin('0')}/>
        <SVGIcon sprite={xIcon} active={curveOrigin == 'x'} onIconClick={()=>onSelectCurveOrigin('x')}/>
        <SVGIcon sprite={yIcon} active={curveOrigin == 'y'} onIconClick={()=>onSelectCurveOrigin('y')}/>
      </MenuDisplaySimple>


      <ToolTips set='settingsMenu'/>
    </div>
  )
};
// <br/>
// <label htmlFor='transform_x'>x position: {transform.x} </label>
// <br/>
// <input id='transform_x' onChange={(e)=>onChangeTransform({x:e.target.value})} type="range" value={transform.x} min="0" max="1000" step="50"/>
// <br/>
// <label htmlFor='transform_order'>order: {transform.order} </label>
// <br/>
// <input id='transform_order' onChange={(e)=>onChangeTransform({order:e.target.value})} type="range" value={transform.order} min="0.25" max="3" step="0.25"/>
// <br/>
// <label htmlFor='transform_factor'>factor: {transform.factor} </label>
// <br/>
// <input id='transform_factor' onChange={(e)=>onChangeTransform({factor:e.target.value})} type="range" value={transform.factor} min="-1" max="1" step="0.1"/>


class MenuDisplayMain extends React.Component {
  constructor(props) {
    super(props);
    this.resChange = null
    this.mapDispatchToProps = dispatch => {
      return {
        onSelectShape: shape => dispatch(choosePlotShape(shape)),
        onChangeResolution: value => {
          this.props.clearTimeouts()
          this.props.setTimeout(()=>dispatch(choosePlotResolution(value)),500)
          return dispatch(setPlotResolution(value))
        },
        onSelectReducer: reducer => dispatch(chooseZReducer(reducer)),
        onSelectScale: scale => dispatch(chooseZScale(scale)),
        onSelectView: view => dispatch(chooseView(view)),
        onSelectCurveOrigin: origin => dispatch(chooseCurveOrigin(origin)),
        onChangeTransform: object => dispatch(setTransformFunction(object))
      }
    }

    this.mapStateToProps = (state, props) => {
      return {
        title:getAxisTitle(state,'z'),
        shape:getPlotShape(state),
        resolution:getPlotResolution(state),
        reducer:getZReducer(state),
        scale:getZScale(state),
        curveOrigin:getCurveOrigin(state),
        transform:getTransformFunctionParams(state)
      }
    }
  }

  render(){
    const DisplayMain = connect(
      this.mapStateToProps,
      this.mapDispatchToProps
    )(DisplayMenu)
    return <DisplayMain {...this.props}/>
  }
}
export default Timeout(MenuDisplayMain)
