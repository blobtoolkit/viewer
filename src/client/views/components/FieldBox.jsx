import React from 'react'
import styles from './Fields.scss';
import FieldBoxHeader from './FieldBoxHeader'
import FieldRawDataPreview from './FieldRawDataPreview'
import Filter from './Filter'
import { getFieldMetadata, getFilterMetadata } from '../reducers/repository'

class FieldBox extends React.Component {
  constructor(props) {
    super(props);
  }
  toggleState(key){
    let obj = {id:this.props.fieldId};
    obj[key] = this.props.hasOwnProperty(key) ? !this.props[key] : true;
    this.props.toggleActive(obj);
    this.props.showData(this.props.fieldId);
  }
  render(){
    let outer_css = styles.outer
    if (this.props.active){
      outer_css += ' '+styles.expanded;
    }
    let filterType = false;
    return (
      <div id={this.props.fieldId} className={outer_css} onClick={()=>{}}>
        <FieldBoxHeader {...this.props} onHeaderClick={()=>{this.toggleState('active')}}/>
        <div className={styles.main}>
          <FieldRawDataPreview {...this.props}/>
        </div>
        <Filter {...this.props} />
      </div>
    );
  }
}

export default FieldBox
