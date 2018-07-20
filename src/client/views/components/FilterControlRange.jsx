import React from 'react'
import styles from './Filters.scss'

class FilterControlRange extends React.Component {
  constructor(props) {
    super(props);
    this.state = {low:props.filterRange[0],high:props.filterRange[1]}
  }
  isNumeric(n) {
    if ((typeof n === 'undefined') || n == 'NaN') return false
    return !isNaN(parseFloat(n)) && isFinite(n)
  }
   render() {
     return (
      <div rel={this.props.filterRange[0]} className={styles.range}>
        <input
          type='number'
          className={styles.range_input}
          value={this.state.low}
          onChange={e=>{
            this.setState({low:e.target.value})
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
              let range = this.props.filterRange;
              let value = e.target.value;
              console.log(value)
              let index = 1
              if (this.props.filterLimit[0] <= value){
                range[0] = value
              }
              else {
                range[0] = this.props.filterLimit[0]
                index = -1
              }
              this.props.onUpdateRange(this.props.filterId,range,index)
            }
          }
          data-tip data-for='range-input' />
        &nbsp;:&nbsp;
        <input
          type='number'
          className={styles.range_input}
          value={this.state.high}
          onChange={e=>{
            this.setState({high:e.target.value})
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
              let range = this.props.filterRange;
              let value = e.target.value;
              console.log(value)
              let index = 2
              if (this.props.filterLimit[1] >= value){
                range[1] = value
              }
              else {
                range[1] = this.props.filterLimit[1]
                index = -2
              }
              this.props.onUpdateRange(this.props.filterId,range,index)
            }
          }
          data-tip data-for='range-input' />
      </div>
    )
  }
}


export default FilterControlRange
