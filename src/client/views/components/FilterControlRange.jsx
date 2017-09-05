import React from 'react'
import styles from './Filters.scss';


class FilterControlRange extends React.Component {
   render() {
     return (
      <div rel={this.props.filterRange[0]} className={styles.range}>
        <input
          type='text'
          className={styles.range_input}
          value={this.props.filterRange[0]}
          onChange={(e)=>{
            let range = this.props.filterRange;
            range[0] = e.target.value*1;
            this.props.onUpdateRange(this.props.filterId,range)
          }} />
        &nbsp;:&nbsp;
        <input
          type='text'
          className={styles.range_input}
          value={this.props.filterRange[1]}
          onChange={(e)=>{
            let range = this.props.filterRange;
            range[1] = e.target.value*1;
            this.props.onUpdateRange(this.props.filterId,range)
          }} />
      </div>
    )
  }
}


export default FilterControlRange
