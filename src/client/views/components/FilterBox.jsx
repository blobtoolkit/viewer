import React from 'react'
import styles from './Filters.scss';
import FilterPreview from './FilterPreview'
import FilterBoxHeader from './FilterBoxHeader'
import FilterDisplayRange from './FilterDisplayRange'
import FilterDisplayCategory from './FilterDisplayCategory'

class FilterBox extends React.Component {
  render(){
    let display
    if (this.props.filterType == 'range'){
      display = <FilterDisplayRange {...this.props}/>
    }
    else if (this.props.filterType == 'category'){
      display = <FilterDisplayCategory {...this.props}/>
    }
    return (
      <div className={styles.outer}>
        <FilterPreview {...this.props}/>
        {display}
        <FilterBoxHeader {...this.props}/>
      </div>
    );
  }
}

export default FilterBox
