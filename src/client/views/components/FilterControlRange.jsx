import React from 'react'
import styles from './Fields.scss';


class FilterControlRange extends React.Component {
   render() {
     return (
      <div className={styles.range}>
        <input type='text' className={styles.range_input} value={this.props.filterRange[0]} onChange={(e)=>{this.props.update(e.target.value,0)}}/>
        &nbsp;:&nbsp;
        <input type='text' className={styles.range_input} value={this.props.filterRange[1]} onChange={(e)=>{this.props.update(e.target.value,1)}}/>
      </div>
    )
  }
}


export default FilterControlRange
