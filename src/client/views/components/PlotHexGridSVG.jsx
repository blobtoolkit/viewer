import React from 'react';
import { connect } from 'react-redux'
import styles from './Plot.scss'
import { getSelectedHexGrid } from '../reducers/plotHexBins'
import { addRecords, removeRecords } from '../reducers/select'
import Pointable from 'react-pointable';
import {
  grid as gridStyle,
  gridShape,
  gridShapeSelected,
  gridShapePartSelected
} from './PlotStyles'

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
    let style = gridShape
    if (datum.selected){
      style = gridShapeSelected
      if (datum.selected < datum.ids.length){
        style = gridShapePartSelected
      }
    }
    hexes.push(
      <polygon
        key={i}
        style={style}
        points={datum.points}
        fill={datum.color}
      />
    )
  })
  return (
    <g transform='translate(50, 50)' style={{gridStyle}}>
    {hexes}
    </g>
  )
};
