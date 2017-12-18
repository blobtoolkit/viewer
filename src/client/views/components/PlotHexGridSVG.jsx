import React from 'react';
import { connect } from 'react-redux'
import styles from './Plot.scss'
import { getSelectedHexGrid } from '../reducers/plotHexBins'
import { addRecords, removeRecords } from '../reducers/select'

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
        />
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
      <polygon key={i}
        className={css}
        points={datum.points}
        style={{fill:datum.color}}
        onMouseOver={()=>{
          if (mouseDown){
            onClickCell(datum.ids)
          }
        }}
        onMouseDown={()=>{
          if (datum.selected){
            setAddRecords(false)
          }
          else {
            setAddRecords(true)
          }
          setMouseDown(true)
        }}
        onMouseUp={()=>{
          setMouseDown(false)
        }}
        onTouchStart={(e)=>{
          // TODO: support touch events - need to find bins by coords returned by nativeEvent
          e.preventDefault()
          if (datum.selected){
            setAddRecords(false)
          }
          else {
            setAddRecords(true)
          }
          setMouseDown(true)
        }}
        onTouchMove={(e)=>{
          console.log(e.nativeEvent)
          e.preventDefault(); if (mouseDown){onClickCell(datum.ids)}
        }}
        onTouchEnd={(e)=>{
          console.log(e)
          e.preventDefault(); setMouseDown(false)
        }}
        onTouchCancel={(e)=>{
          console.log(e)
          e.preventDefault(); setMouseDown(false)
        }}
      />)
  })
  return (
    <g className={styles.grid}>
    {hexes}
    </g>
  )
};
