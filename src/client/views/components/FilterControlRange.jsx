import React from 'react'
import styles from './Filters.scss'

class FilterControlRange extends React.Component {
  isNumeric(n) {
    if ((typeof n === 'undefined') || n == 'NaN') return false
    return !isNaN(parseFloat(n)) && isFinite(n)
  }
   render() {
     return (
      <div rel={this.props.filterRange[0]} className={styles.range}>
        <input
          type='text'
          className={styles.range_input}
          value={this.props.filterRange[0]}
          onChange={(e)=>{
            let range = this.props.filterRange;
            let index = 1
            if (this.props.filterLimit[0] <= e.target.value){
              range[0] = e.target.value
            }
            else {
              range[0] = e.target.value
              index = -1
            }
            this.props.onUpdateRange(this.props.filterId,range,index)
          }}
          data-tip data-for='range-input' />
        &nbsp;:&nbsp;
        <input
          type='text'
          className={styles.range_input}
          value={this.props.filterRange[1]}
          onChange={(e)=>{
            let range = this.props.filterRange;
            let index = 2
            if (this.props.filterLimit[1] >= e.target.value){
              range[1] = e.target.value
            }
            else {
              range[1] = e.target.value
              index = -2
            }
            this.props.onUpdateRange(this.props.filterId,range,index)
          }}
          data-tip data-for='range-input' />
      </div>
    )
  }
}


export default FilterControlRange
