import React from 'react';
import { connect } from 'react-redux'
import styles from './Plot.scss'
import { getSelectedHexGrid } from '../reducers/plotHexBins'
import { addRecords, removeRecords } from '../reducers/select'
import Pointable from 'react-pointable';

export default class PlotHexGridSVG extends React.Component {
  constructor(props) {
    super(props);
    this.state = {mouseDown:false,addRecords:true}
    this.mapStateToProps = () => {
      return (state, props) => {
        return getSelectedHexGrid(state)
      }
    }
    this.mapDispatchToProps = dispatch => {
      return {
        onClickCell:(arr) => {
          if (this.state.addRecords){
            return dispatch(addRecords(arr))
          }
          return dispatch(removeRecords(arr))
        }
      }
    }
  }

  setMouseDown(bool){
    this.setState({mouseDown:bool})
  }

  setAddRecords(bool){
    this.setState({addRecords:bool})
  }

  render(){
    const ConnectedHexGrid = connect(
      this.mapStateToProps,
      this.mapDispatchToProps
    )(HexGridSVG)
    return (
      <ConnectedHexGrid {...this.props}
        mouseDown={this.state.mouseDown} setMouseDown={(bool)=>this.setMouseDown(bool)}
        addRecords={this.state.addRecords} setAddRecords={(bool)=>this.setAddRecords(bool)}
        ></ConnectedHexGrid>
    )
  }
}

const HexGridSVG = ({ data, onClickCell, mouseDown, setMouseDown, setAddRecords }) => {
  let hexes = []
  data.forEach((datum,i)=>{
    let css = styles.hex
    if (datum.selected){
      css += ' '+styles.selected
      if (datum.selected < datum.ids.length){
        css += ' '+styles.partial
      }
    }
    hexes.push(
      // <Pointable
      //   key={i}
      //   tagName='g'
      //   onPointerMove={(e)=>{
      //     e.preventDefault()
      //     console.log(e.layerX + ' ' + e.layerY)
      //     if (mouseDown){
      //       onClickCell(datum.ids)
      //     }
      //   }}
      //   onPointerLeave={(e)=>{
      //     e.preventDefault()
      //     //e.target.releasePointerCapture(e.pointerId)
      //     console.log(e)
      //     console.log('left')
      //   }}
      //   onPointerEnter={(e)=>{
      //     e.preventDefault()
      //     //e.target.releasePointerCapture(e.pointerId)
      //     console.log('entered')
      //   }}
      //   onPointerDown={(e)=>{
      //     e.preventDefault()
      //     //e.target.setPointerCapture(e.pointerId)
      //     if (datum.selected){
      //       setAddRecords(false)
      //     }
      //     else {
      //       setAddRecords(true)
      //     }
      //     setMouseDown(true)
      //   }}
      //   onPointerUp={(e)=>{
      //     e.preventDefault()
      //     setMouseDown(false)
      //   }}
      //   >
        <polygon
          key={i}
          className={css}
          points={datum.points}
          fill={datum.color}
          // onMouseOver={()=>{
          //   if (mouseDown){
          //     onClickCell(datum.ids)
          //   }
          // }}
          // onMouseDown={()=>{
          //   if (datum.selected){
          //     setAddRecords(false)
          //   }
          //   else {
          //     setAddRecords(true)
          //   }
          //   setMouseDown(true)
          // }}
          // onMouseUp={()=>{
          //   setMouseDown(false)
          // }}
          // onTouchStart={(e)=>{
          //   // TODO: support touch events - need to find bins by coords returned by nativeEvent
          //   e.preventDefault()
          //   if (datum.selected){
          //     setAddRecords(false)
          //   }
          //   else {
          //     setAddRecords(true)
          //   }
          //   setMouseDown(true)
          // }}
          // onTouchMove={(e)=>{
          //   // console.log(e.nativeEvent)
          //   e.preventDefault(); if (mouseDown){onClickCell(datum.ids)}
          // }}
          // onTouchEnd={(e)=>{
          //   e.preventDefault(); setMouseDown(false)
          // }}
          // onTouchCancel={(e)=>{
          //   e.preventDefault(); setMouseDown(false)
          // }}
        />
      //</Pointable>
    )
  })
  return (
    <g className={styles.padded_main + ' ' + styles.grid}>
    {hexes}
    </g>
  )
};
