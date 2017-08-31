import React from 'react'
import styles from './Filters.scss';
//import Resizable from 'react-resizable-box'
import { DraggableCore } from 'react-draggable'

class FilterDisplayRange extends React.Component {

  render(){
    return (
      <FilterHandles {...this.props}>
        <FilterHandle key='right' handlePosition='right' range={this.props.filterRange} update={this.props.onUpdateRange} xScale={this.props.xScale}/>
        <FilterHandle key='left' handlePosition='left' range={this.props.filterRange} update={this.props.onUpdateRange} xScale={this.props.xScale}/>
      </FilterHandles>
    )
  }
}

class FilterHandles extends React.Component {
  render() {
    return (
      <div className={styles.handles_container}>
        {this.props.children}
      </div>
    )
  }
}

class FilterHandle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {offsetX:0}
  }
  bound(){
    return this.props.handlePosition == 'right' ? 1 : 0
  }
  boundPx(){
    return this.props.xScale(this.props.range[this.bound()]);
  }
  updateRange(value,bound) {
    let range = this.props.range;
    range[bound] = value;
    this.props.update(this.props.filterId,range)
  }
  render(){
    return (
      <DraggableCore
        axis='x'
        bounds='parent'
        onStop={(e)=>{
          this.updateRange(this.props.xScale.invert(e.x),this.bound())
        }}
        onDrag={(e)=>{
          this.setState({offsetX:e.x-this.boundPx()})
        }}
        >
        <div style={{left: (this.boundPx()+this.state.offsetX)+'px'}}
        className={styles.handle+' '+styles[this.props.handlePosition]}></div>
      </DraggableCore>
    )
  }
}


export default FilterDisplayRange
