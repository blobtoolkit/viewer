import React from 'react';
import { connect } from 'react-redux'
//import styles from './Plot.scss'
import { getAxisTitle } from '../reducers/plotData'
import { getRecordCount, getBuscoSets } from '../reducers/summary'
import { getStaticFields } from '../reducers/dataset'
import { getFields } from '../reducers/field'
import { getPlotShape,
  choosePlotShape,
  getPlotResolution,
  setPlotResolution,
  choosePlotResolution,
  getPngResolution,
  choosePngResolution,
  getPlotGraphics,
  choosePlotGraphics,
  getSVGThreshold,
  chooseSVGThreshold,
  getCircleLimit,
  chooseCircleLimit,
  getZReducer,
  chooseZReducer,
  getZScale,
  chooseZScale,
  getPlotScale,
  choosePlotScale,
  getTransformFunctionParams,
  setTransformFunction,
  getCurveOrigin,
  chooseCurveOrigin,
  getScaleTo,
  chooseScaleTo,
  getSnailOrigin,
  chooseSnailOrigin } from '../reducers/plotParameters'
import {
  getStaticThreshold,
  chooseStaticThreshold,
  getNohitThreshold,
  chooseNohitThreshold } from '../reducers/repository'
import { chooseView, toggleStatic, getView, getStatic, getDatasetID, getParsedQueryString, setQueryString } from '../reducers/location'
import { getMainPlotData }  from '../reducers/plotData'
import { queryToStore } from '../querySync'
import styles from './Layout.scss'
import MenuDisplaySet from './MenuDisplaySet'
import MenuDisplaySimple from './MenuDisplaySimple'
import SVGIcon from './SVGIcon'
import TextIcon from './TextIcon'
import squareIcon from './svg/squareShape.svg';
import hexIcon from './svg/hexShape.svg';
import circleIcon from './svg/circleShape.svg';
import svgIcon from './svg/svg.svg';
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
import invertIcon from './svg/invert.svg';
import scaleIcon from './svg/scale.svg';
import MenuItem from './MenuItem'
import ToolTips from './ToolTips'
import Timeout from './Timeout'
import MenuDataset from './MenuDataset'
import { format as d3Format } from 'd3-format'
import Palettes from '../containers/Palettes'

class DisplayMenu extends React.Component {
  render(){
    let { datasetId, title, view, busco, records, isStatic, hasStatic,
      shape, onSelectShape,
      resolution, onChangeResolution,
      graphics, onChangeGraphics,
      threshold, onChangeThreshold,
      circleLimit, onChangeCircleLimit,
      reducer, onSelectReducer,
      scale, onSelectScale,
      curveOrigin, onSelectCurveOrigin,
      scaleTo, onSelectScaleTo,
      snailOrigin, onSelectSnailOrigin,
      transform, onChangeTransform,
      plotScale, onChangePlotScale,
      onSelectView, onToggleStatic,
      pngResolution, onChangePngResolution,
      staticThreshold, onChangeStaticThreshold,
      nohitThreshold, onChangeNohitThreshold,
      data={}, onChangeAxisRange, parsed, changeQueryParams } = this.props
    let context
    view = view || 'blob'
    let blob
    let xMeta = data.meta ? data.meta.x.meta : {limit:[0,1],range:[0,1]}
    let yMeta = data.meta ? data.meta.y.meta : {limit:[0,1],range:[0,1]}
    const resetLimits = (meta) => {
      let values = {}
      if (meta.limit[0] != meta.range[0]){
        values[meta.id+'--LimitMin'] = meta.range[0]
        values[meta.id+'--Min'] = meta.range[0]
      }
      if (meta.limit[1] != meta.range[1]){
        values[meta.id+'--LimitMax'] = meta.range[1]
        values[meta.id+'--Max'] = meta.range[1]
      }
      let remove = [
        meta.id+'--LimitMin',
        meta.id+'--Min',
        meta.id+'--LimitMax',
        meta.id+'--Max'
      ]
      remove.forEach(key=>{
        delete parsed[key]
      })
      onChangeAxisRange(values, remove)
      changeQueryParams(parsed)
    }
    if (isStatic){
      blob = (
        <MenuDisplaySimple name='shape'>
          <SVGIcon sprite={squareIcon} active={shape == 'square'} onIconClick={()=>onSelectShape('square')}/>
          <SVGIcon sprite={hexIcon} active={shape == 'hex'} onIconClick={()=>onSelectShape('hex')}/>
          <SVGIcon sprite={circleIcon} active={shape == 'circle'} onIconClick={()=>onSelectShape('circle')}/>
        </MenuDisplaySimple>
      )
    }
    else {
      blob = (
        <span>
          <MenuDisplaySimple name='shape'>
            <SVGIcon sprite={squareIcon} active={shape == 'square'} onIconClick={()=>onSelectShape('square')}/>
            <SVGIcon sprite={hexIcon} active={shape == 'hex'} onIconClick={()=>onSelectShape('hex')}/>
            <SVGIcon sprite={circleIcon} active={shape == 'circle'} onIconClick={()=>onSelectShape('circle')}/>
          </MenuDisplaySimple>
          <MenuDisplaySimple name={'resolution [ '+resolution+' ]'}>
            <div className={styles.full_height}>
              <span className={styles.middle}>50</span>
              <input onChange={(e)=>onChangeResolution(e.target.value)}
                type="range"
                value={resolution}
                min="5"
                max="50"
                step="1"
                className={styles.flip_horiz+' '+styles.middle}
                data-tip data-for='size-slider'
                />
              <span className={styles.middle}>5</span>
            </div>
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
          <MenuDisplaySimple name={'scale factor [ '+d3Format(",.1f")(plotScale)+' ]'}>
            <div className={styles.full_height}>
              <span className={styles.middle}>0.1</span>
              <input onChange={(e)=>onChangePlotScale(e.target.value)}
                type="range"
                value={plotScale}
                min="0.1"
                max="2"
                step="0.1"
                className={styles.middle}
                data-tip data-for='scale-slider'
                />
              <span className={styles.middle}>2.0</span>
            </div>

          </MenuDisplaySimple>
          <MenuDisplaySimple name='x-axis range'>
            <div className={styles.full_height}>
              { (xMeta.limit[0] != xMeta.range[0] || xMeta.limit[1] != xMeta.range[1])
                && <span className={styles.reset} onClick={()=>resetLimits(xMeta)}>reset</span>
              }
              <NumericInput initialValue={isNaN(xMeta.limit[0]) ? xMeta.range[0] : xMeta.limit[0]} onChange={(value)=>onChangeAxisRange({[xMeta.id+'--LimitMin']:value,[xMeta.id+'--Min']:value})}/>
              <NumericInput initialValue={isNaN(xMeta.limit[1]) ? xMeta.range[1] : xMeta.limit[1]} onChange={(value)=>onChangeAxisRange({[xMeta.id+'--LimitMax']:value,[xMeta.id+'--Max']:value})}/>
            </div>
          </MenuDisplaySimple>
          {yMeta && <MenuDisplaySimple name='y-axis range'>
            <div className={styles.full_height}>
              { (yMeta.limit[0] != yMeta.range[0] || yMeta.limit[1] != yMeta.range[1])
                && <span className={styles.reset} onClick={()=>resetLimits(yMeta)}>reset</span>
              }
              <NumericInput initialValue={isNaN(yMeta.limit[0]) ? yMeta.range[0] : yMeta.limit[0]} onChange={(value)=>onChangeAxisRange({[yMeta.id+'--LimitMin']:value,[yMeta.id+'--Min']:value})}/>
              <NumericInput initialValue={isNaN(yMeta.limit[1]) ? yMeta.range[1] : yMeta.limit[1]} onChange={(value)=>onChangeAxisRange({[yMeta.id+'--LimitMax']:value,[yMeta.id+'--Max']:value})}/>
            </div>
          </MenuDisplaySimple> }
          {shape == 'circle' && <MenuDisplaySimple name='plot graphics'>
            <div className={styles.full_height}>
              <label className={styles.middle} htmlFor="#svgThreshold">Threshold</label>
              <NumericInput initialValue={threshold} onChange={onChangeThreshold}/>
              <span className={styles.middle}>or</span>
            </div>
            <SVGIcon sprite={svgIcon} active={graphics == 'svg'} onIconClick={()=>onChangeGraphics(graphics == 'svg' ? 'canvas' : 'svg')}/>
          </MenuDisplaySimple>}
          {shape == 'circle' && <MenuDisplaySimple name='circle limit'>
            <div className={styles.full_height}>
              <NumericInput initialValue={circleLimit} onChange={onChangeCircleLimit}/>
            </div>
          </MenuDisplaySimple>}
        </span>
      )
    }
    let cumulative = (
      <span>
        <MenuDisplaySimple name='curve origin'>
          <SVGIcon sprite={zeroIcon} active={curveOrigin == '0'} onIconClick={()=>onSelectCurveOrigin('0')}/>
          <SVGIcon sprite={xIcon} active={curveOrigin == 'x'} onIconClick={()=>onSelectCurveOrigin('x')}/>
          <SVGIcon sprite={yIcon} active={curveOrigin == 'y'} onIconClick={()=>onSelectCurveOrigin('y')}/>
          <SVGIcon sprite={scaleIcon} active={scaleTo == 'filtered'} onIconClick={()=>onSelectScaleTo(scaleTo == 'total' ? 'filtered' : 'total')}/>
        </MenuDisplaySimple>
      </span>
    )
    let snail = (
      <span>
        <MenuDisplaySimple name='snail origin'>
          <SVGIcon sprite={invertIcon} active={snailOrigin == 'center'} onIconClick={()=>onSelectSnailOrigin(snailOrigin == 'center' ? 'outer' : 'center')}/>
          <SVGIcon sprite={scaleIcon} active={scaleTo == 'filtered'} onIconClick={()=>onSelectScaleTo(scaleTo == 'total' ? 'filtered' : 'total')}/>
        </MenuDisplaySimple>
      </span>
    )
    switch (view) {
      case 'blob':
        context = blob
        break
      case 'busco':
        break
      case 'cumulative':
        context = cumulative
        break
      case 'report':
        context = (
          <span>
            {blob}
            {cumulative}
            {snail}
          </span>
        )
        break
      case 'snail':
        context = snail
        break
      case 'table':
        break
      case 'treemap':
        break
    }
    let showBlob
    if (data.axes && data.axes.y.values.length >0){
      showBlob = true
    }
    return (
      <div className={styles.menu_outer}>
        <MenuDataset
          key={datasetId}
          id={datasetId}
          active={false}
          onDatasetClick={()=>{}}
          onDatasetMount={()=>{}}
        />
        <MenuDisplaySimple invert={false}>
          <TextIcon title='interactive' active={!isStatic} onIconClick={()=>onToggleStatic(false,datasetId)}/>
          {hasStatic && <TextIcon title='static' active={isStatic} onIconClick={()=>onToggleStatic(view,datasetId)}/>}
        </MenuDisplaySimple>
        <MenuDisplaySimple invert={false}>
          {showBlob && <TextIcon title='blob' active={view == 'blob'} onIconClick={()=>onSelectView('blob')}/>}
          <TextIcon title='busco' active={view == 'busco'} onIconClick={()=>onSelectView('busco')}/>
          <TextIcon title='cumulative' active={view == 'cumulative'} onIconClick={()=>onSelectView('cumulative')}/>
          <TextIcon title='detail' active={view == 'detail'} onIconClick={()=>onSelectView('detail')}/>
          {isStatic || <TextIcon title='report' active={view == 'report'} onIconClick={()=>onSelectView('report')}/>}
          <TextIcon title='snail' active={view == 'snail'} onIconClick={()=>onSelectView('snail')}/>
          {isStatic || <TextIcon title='table' active={view == 'table'} onIconClick={()=>onSelectView('table')}/>}
        </MenuDisplaySimple>
        <MenuDisplaySet name={view}>
          {isStatic && view != 'blob' || context}
        </MenuDisplaySet>
        { isStatic || <Palettes />}
        { isStatic || <MenuDisplaySimple name='png resolution (px)'>
          <NumericInput initialValue={pngResolution} onChange={onChangePngResolution}/>
        </MenuDisplaySimple>}
        <MenuDisplaySimple name='static threshold'>
          <NumericInput
            initialValue={staticThreshold}
            onChange={(value)=>{
              onChangeStaticThreshold(value)
              setTimeout(
                ()=>{
                  if (value >= records && isStatic){
                    onToggleStatic(false,datasetId)
                  }
                  else if (value < records && !isStatic){
                    onToggleStatic(view,datasetId)
                  }
                },500
              )
            }}/>
        </MenuDisplaySimple>
        <MenuDisplaySimple name='nohit threshold'>
          <NumericInput
            initialValue={nohitThreshold}
            onChange={(value)=>{
              onChangeNohitThreshold(value)
            }}/>
        </MenuDisplaySimple>

        <ToolTips set='settingsMenu'/>
      </div>
    )
  }
}
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


class NumericInput extends React.Component {
  constructor(props) {
    super(props);
    let value = isNaN(this.props.initialValue) ? 0 : this.props.initialValue
    this.state = {value}
  }

  componentDidUpdate(nextProps) {
    let value = isNaN(this.props.initialValue) ? 0 : this.props.initialValue
    let npvalue = isNaN(nextProps.initialValue) ? 0 : nextProps.initialValue
    if (npvalue != value){
      this.setState({value})
    }
  }
  render(){
    return (
      <input
        type='number'
        className={styles.range_input}
        value={this.state.value}
        onChange={e=>{
          this.setState({value:e.target.value})
        }}
        onKeyUp={
          (e)=>{
            if (e.key === 'Enter') {
              e.target.blur()
            }
          }
        }
        onBlur={
          (e)=>{
            this.props.onChange(e.target.value)
          }
        }
      />
    )
  }
}

class MenuDisplayMain extends React.Component {
  constructor(props) {
    super(props);
    this.resChange = null
    this.mapDispatchToProps = dispatch => {
      return {
        onSelectShape: shape => dispatch(choosePlotShape(shape)),
        onChangeResolution: value => {
          this.props.clearTimeouts()
          this.props.setTimeout(()=>dispatch(choosePlotResolution(value)),1000)
          return dispatch(setPlotResolution(value))
        },
        onChangeGraphics: graphics => dispatch(choosePlotGraphics(graphics)),
        onChangeThreshold: threshold => dispatch(chooseSVGThreshold(threshold)),
        onChangePngResolution: resolution => dispatch(choosePngResolution(resolution)),
        onChangeStaticThreshold: threshold => dispatch(chooseStaticThreshold(threshold)),
        onChangeNohitThreshold: threshold => dispatch(chooseNohitThreshold(threshold)),
        onChangeCircleLimit: limit => dispatch(chooseCircleLimit(limit)),
        onSelectReducer: reducer => dispatch(chooseZReducer(reducer)),
        onSelectScale: scale => dispatch(chooseZScale(scale)),
        onChangePlotScale: plotScale => dispatch(choosePlotScale(plotScale)),
        onSelectView: view => dispatch(chooseView(view)),
        onToggleStatic: (view,datasetId) => dispatch(toggleStatic(view,datasetId)),
        onSelectCurveOrigin: origin => dispatch(chooseCurveOrigin(origin)),
        onSelectScaleTo: origin => dispatch(chooseScaleTo(origin)),
        onSelectSnailOrigin: origin => dispatch(chooseSnailOrigin(origin)),
        onChangeTransform: object => dispatch(setTransformFunction(object)),
        onChangeAxisRange: (values,remove) => dispatch(queryToStore({values,remove,action:'FILTER'})),
        changeQueryParams: (obj) => dispatch(setQueryString(Object.keys(obj).map(k=>`${k}=${obj[k]}`).join('&')))
      }
    }

    this.mapStateToProps = (state, props) => {
      return {
        title:getAxisTitle(state,'z'),
        records:getRecordCount(state),
        shape:getPlotShape(state),
        resolution:getPlotResolution(state),
        graphics:getPlotGraphics(state),
        threshold:getSVGThreshold(state),
        pngResolution:getPngResolution(state),
        staticThreshold:getStaticThreshold(state),
        nohitThreshold:getNohitThreshold(state),
        circleLimit:getCircleLimit(state),
        reducer:getZReducer(state),
        scale:getZScale(state),
        plotScale:getPlotScale(state),
        curveOrigin:getCurveOrigin(state),
        scaleTo:getScaleTo(state),
        snailOrigin:getSnailOrigin(state),
        transform:getTransformFunctionParams(state),
        view: getView(state),
        isStatic: getStatic(state),
        datasetId: getDatasetID(state),
        hasStatic: getStaticFields(state),
        busco: getBuscoSets(state),
        data: getMainPlotData(state),
        parsed: getParsedQueryString(state)

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
