import React from 'react'
import { connect } from 'react-redux'
import styles from './Filters.scss';
import { getCategoryListForFieldId } from '../reducers/preview'
import { editFilter } from '../reducers/filter'
import { setDisplayFirst, getMainPlot } from '../reducers/plot'

function remove(array, element) {
    const index = array.indexOf(element);

    if (index !== -1) {
        array.splice(index, 1);
    }
}

class FilterControlCategory extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = () => {
      return (state, props) => {
        return getCategoryListForFieldId(state, props.filterId)
      }
    }
    this.mapDispatchToProps = dispatch => {
      return {
      //  onUpdateRange: (id,range) => {return dispatch(editFilter({id:id,range:range}))}
        onToggleBin: (index,keys,filter) => {
          filter.toggled[index] = !filter.toggled[index]
          if (filter.toggled[index]){
            keys = keys.concat(filter.keys)
          }
          else {
            keys.forEach(key=>{
              remove(filter.keys,key)
            })
            keys = filter.keys
          }
          console.log(this.props.filterId+' '+keys.length)
          dispatch(editFilter({id:this.props.filterId,toggled:filter.toggled,keys:keys}))
        }
      }
    }
  }

  render(){
    const ConnectedControlCategory = connect(
      this.mapStateToProps,
      this.mapDispatchToProps
    )(ControlCategory)
    return (
      <ConnectedControlCategory filterId={this.props.fieldId} {...this.props}/>
    )
  }
}


class ControlCategory extends React.Component {
   render() {
     let bins = this.props.bins.map((b,i) => {
       let css = styles.category_toggle;
       css += b.toggled == true ? ' '+styles.toggled : ''
       return (
         <span key={i}
           className={css}
           rel={this.props.plot.cat}
           style={{backgroundColor:b.color}}
           onClick={()=>this.props.onToggleBin(i,b.keys,this.props.filter)}>
           &nbsp;
         </span>
       )
     })
     return (
      <div className={styles.inside} data-tip data-for='category-toggle'>
        {bins}
      </div>
    )
  }
}


export default FilterControlCategory
