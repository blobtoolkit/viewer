import React from 'react'
import styles from './Filters.scss';
import FilterControlRange from './FilterControlRange'

class FilterBoxHeader extends React.Component {
  render(){
    let control
    if (this.props.filterType == 'range'){
      control = <FilterControlRange {...this.props}/>
    }
    return (
      <div className={styles.header}>
        {control}
      </div>
    );
  }
}

export default FilterBoxHeader
