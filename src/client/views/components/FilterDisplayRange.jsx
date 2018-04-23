import React from 'react'
import ReactDOM from 'react-dom'
import styles from './Filters.scss';
// import { DraggableCore } from 'react-draggable'
import Pointable from 'react-pointable'

class FilterDisplayRange extends React.Component {

  render(){
    return (
      <FilterHandles {...this.props}>
      </FilterHandles>
    )
  }
}

class FilterHandles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {container:undefined}
  }
  componentDidMount() {
    let container = ReactDOM.findDOMNode(this)
    this.setState({container:container,offsetX:container.getBoundingClientRect().left})
  }
  render() {
    return (
      <div className={styles.handles_container}>
        <FilterHandle {...this.props} key='right' handlePosition='right' parent={this.state.container} parentX={this.state.offsetX} />
        <FilterHandle {...this.props} key='left' handlePosition='left' parent={this.state.container} parentX={this.state.offsetX} />
      </div>
    )
  }
}

class FilterHandle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {offsetX:0,mouseDown:false}
  }
  setMouseDown(bool){
    this.setState({mouseDown:bool})
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
      <Pointable
        tagName='span'
        onPointerMove={(e)=>{
          e.preventDefault()
          if (this.state.mouseDown){
            this.setState({offsetX:e.x-this.props.parentX-this.boundPx()})
          }
        }}
        onPointerDown={(e)=>{
          e.preventDefault()
          this.setMouseDown(true)
        }}
        onPointerUp={(e)=>{
          e.preventDefault()
          if (this.state.mouseDown){
            this.updateRange(this.props.xScale.invert(e.x - this.props.parentX),this.bound())
            this.setMouseDown(false)
          }
        }}
        onPointerLeave={(e)=>{
          e.preventDefault()
          if (this.state.mouseDown){
            this.updateRange(this.props.xScale.invert(e.x - this.props.parentX),this.bound())
            this.setMouseDown(false)
          }
        }}
        >
        <div style={{left: (this.boundPx()+this.state.offsetX)+'px'}}
        className={styles.handle+' '+styles[this.props.handlePosition]}>
          <div className={styles.arrows} data-tip data-for='draggable-arrow'>
            &lt;&nbsp;&gt;
          </div>
        </div>
      </Pointable>
    )
    // return (
    //   <DraggableCore
    //     axis='x'
    //     bounds='parent'
    //     offsetParent={this.props.parent}
    //     onStop={(e)=>{
    //       this.updateRange(this.props.xScale.invert(e.x - this.props.parentX),this.bound())
    //     }}
    //     onDrag={(e)=>{
    //       this.setState({offsetX:e.x-this.props.parentX-this.boundPx()})
    //     }}
    //     >
    //     <div style={{left: (this.boundPx()+this.state.offsetX)+'px'}}
    //     className={styles.handle+' '+styles[this.props.handlePosition]}>
    //       <div className={styles.arrows} data-tip data-for='draggable-arrow'>
    //         &lt;&nbsp;&gt;
    //       </div>
    //     </div>
    //   </DraggableCore>
    // )
  }
}


export default FilterDisplayRange
