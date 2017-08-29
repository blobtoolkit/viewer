import React from 'react'
import styles from './Filters.scss';
//import Resizable from 'react-resizable-box'
import Draggable from 'react-draggable'

class FilterDisplayRange extends React.Component {

  render(){
    console.log(this.props)
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
      <div className={styles.resizables_container}>
        {this.props.children}
      </div>
    )
  }
}

class FilterHandle extends React.Component {
  render(){
    return (
      <Draggable axis='x' bounds='parent'>
        <div className={styles.handle+' '+styles[this.props.handlePosition]}></div>
      </Draggable>
    )
  }
}

/*class FilterHandle extends React.Component {
  bound(){
    return this.props.handlePosition == 'right' ? 1 : 0
  }
  boundPercent(){
    return this.props.xScale(this.props.range[this.bound()])/4;
  }
  updateRange(value,bound) {
    let range = this.props.range;
    range[bound] = value;
    this.props.update(range)
  }
  render() {
    console.log(this.props)
    return (
      <Resizable className={styles.resizable}
        width={this.boundPercent() + '%'}
        bounds={'parent'}
        height={'100%'}
        handlerClasses={{
          right: `${styles.handle} ${styles[this.props.handlePosition]}`
        }}
        enable={{top: false,
          right: true,
          bottom: false,
          left: false,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false}}
        onResize={
          (e,direction,ref,delta) => {}
        }
        onResizeStop={
          (e,direction,ref,delta) => this.updateRange(this.props.xScale.invert(ref.clientWidth),this.bound())
        }
      />
    )
  }
}*/


export default FilterDisplayRange
