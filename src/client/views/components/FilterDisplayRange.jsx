import React from 'react'
import styles from './Filters.scss';
import { DraggableCore } from 'react-draggable'

class FilterDisplayRange extends React.Component {

  render(){
    return (
      <FilterHandles {...this.props}>
        <FilterHandle {...this.props} key='right' handlePosition='right' />
        <FilterHandle {...this.props} key='left' handlePosition='left' />
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
    return this.props.xScale(this.props.filterRange[this.bound()]);
  }
  updateRange(value,bound) {
    let range = this.props.filterRange.slice(0);
    range[bound] = value;
    this.props.onUpdateRange(this.props.filterId,range)
    this.setState({offsetX:0})
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
