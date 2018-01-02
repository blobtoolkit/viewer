import React from 'react'
import styles from './Filters.scss';
import ReactTooltip from 'react-tooltip'

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
            range[0] = e.target.value;
            this.props.onUpdateRange(this.props.filterId,range)
          }}
          data-tip data-for='range-input' />
        &nbsp;:&nbsp;
        <input
          type='text'
          className={styles.range_input}
          value={this.props.filterRange[1]}
          onChange={(e)=>{
            let range = this.props.filterRange;
            range[1] = e.target.value;
            this.props.onUpdateRange(this.props.filterId,range)
          }}
          data-tip data-for='range-input' />
          <ReactTooltip id='range-input'>Set range</ReactTooltip>
      </div>
    )
  }
}


export default FilterControlRange
