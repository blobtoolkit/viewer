import React from 'react'
import styles from './Filters.scss';
import FilterBoxHeader from './FilterBoxHeader'
import FilterDisplayRange from './FilterDisplayRange'

class FilterBox extends React.Component {
  render(){
    let display
    if (this.props.filterType == 'range'){
      display = <FilterDisplayRange {...this.props}/>
    }
    return (
      <div className={styles.outer}>
        <FilterBoxHeader {...this.props}/>
        {display}
      </div>
    );
  }
}

export default FilterBox
